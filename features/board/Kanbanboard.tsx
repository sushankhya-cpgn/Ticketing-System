import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { setBoards, fetchBoards } from "./boardSlice";
import Column from "../../components/Column/Column";
import TaskCard from "../../components/Card/TaskCard";
import { type AppDispatch, type RootState } from "../../app/store";
import api from "../../src/api/axiosClient";
import connection, { startConnection } from "../../src/services/signalR/connection";
import { HubConnectionState } from "@microsoft/signalr";
import Modal from "../../components/Modal/Modal";
import TextFieldComponent from "../../components/Fields/TextFieldComponent";
import { TicketApi } from "../../src/api/ticketApi";
import ButtonComponent from "../../components/Buttons/button";
import BlankButton from "../../components/Buttons/BlankButton"
import { KanBanApi } from "../../src/api/kanbanApi";
import AttachmentCard from "../../components/Card/AttachmentCard";



interface Reply {
  commentID: number;
  parentCommentID: number | null;
  commentText: string;
  commentedBy: number;
  commentedAt: string;
  replies: Reply[]
}

interface Comment {
  commentID: number;
  parentCommentID: number | null;
  commentText: string;
  commentedBy: number;
  commentedAt: string;
  replies: Reply[];
}

interface CommentItemProps {
  comment: Comment | Reply;
  userId: number | null;
  onReply: (parentID: number, text: string) => void;
  onDelete: (commentID: number) => void;
}

interface TaskCardTypes {
  id: string;
  content: string;
  title?: string;
  description?: string;
  priority?: string;
  assignedTo?: string;
  createdBy?: string;
  tags?: string[];
  comments?: Comment[];
}

interface BoardColumn {
  id: string;     // statusId
  title: string;
  cards: TaskCardTypes[];
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, userId, onReply, onDelete }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  return (
    <div className="border-l-2 border-gray-300 pl-4 ml-2 mt-2">
      <p className="font-medium">User {comment.commentedBy}</p>
      <p>{comment.commentText}</p>

      <div className="flex gap-2 mt-1">
        <BlankButton label="Reply" onClick={() => setShowReplyBox(!showReplyBox)} />
        {comment.commentedBy === userId && (
          <BlankButton
            label="Delete"
            onClick={() => onDelete(comment.commentID)}
            sx={{ color: "red" }}
          />
        )}
      </div>

      {showReplyBox && (
        <div className="mt-2 ml-4">
          <TextFieldComponent
            label="Write a reply..."
            value={replyText}
            onChange={(e: any) => setReplyText(e.target.value)}
          />
          {replyText && (
            <div className="flex gap-2 mt-2">
              <ButtonComponent
                onClick={() => {
                  onReply(comment.commentID, replyText);
                  setReplyText("");
                  setShowReplyBox(false);
                }}
                label="Send"
                height="35px"
                sx={{ backgroundColor: "green" }}
              />
              <BlankButton label="Cancel" onClick={() => setShowReplyBox(false)} />
            </div>
          )}
        </div>
      )}

      {/* Render replies recursively */}
      {comment.replies?.length > 0 && (
        <div className="ml-6 mt-2 flex flex-col gap-2">
          {comment.replies.map((r: any) => (
            <CommentItem
              key={r.commentID}
              comment={r}
              userId={userId}
              onReply={onReply}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function KanbanBoard() {
  const boards = useSelector((s: RootState) => s.board.value);
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const userId = useSelector((state: RootState) => state.auth.userID)

  // ✨ Comment states
  const [commentText, setCommentText] = useState("");


  // -------------------------
  // LOAD TICKET DETAILS
  // -------------------------
  const handleCardClick = async (card: any) => {
    try {
      // const res = await TicketApi.getTicketById(card.id);
      const res = await KanBanApi.getById(card.id);
      setSelectedCard(res.data.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to load ticket details", err);
    }
  };



  const addComment = async () => {
    if (!selectedCard) return;
    if (!commentText.trim()) return;

    await TicketApi.addComment({
      ticketId: selectedCard.ticketID ?? selectedCard.id,
      commentText, // top-level comment
    });

    const updated = await KanBanApi.getById(selectedCard.ticketID ?? selectedCard.id);
    setSelectedCard(updated.data.data);

    setCommentText("");
  };


  // -------------------------
  //Delete Comment
  // -------------------------

  async function deleteComment(commentID: number) {
    if (!selectedCard) return;
    try {
      await TicketApi.deleteComment(commentID);
      const updated = await KanBanApi.getById(selectedCard.ticketID ?? selectedCard.id);
      setSelectedCard(updated.data.data);
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  }

  // -------------------------
  // ADD REPLY
  // -------------------------

  const addReply = async (parentID: number, text: string) => {
    if (!text.trim()) return;

    await TicketApi.addComment({
      ticketId: selectedCard.ticketID ?? selectedCard.id,
      parentCommentID: parentID,
      commentText: text,
    });

    // Refresh ticket details
    const updated = await KanBanApi.getById(selectedCard.ticketID ?? selectedCard.id);
    setSelectedCard(updated.data.data);
  };

  // -------------------------
  // SIGNALR + FETCH BOARD
  // -------------------------
  useEffect(() => {
    dispatch(fetchBoards());
    startConnection();

    connection.on("TicketMoved", () => {
      dispatch(fetchBoards());
    });

    return () => {
      connection.off("TicketMoved");
      if (connection.state === HubConnectionState.Connected) {
        connection.stop();
      }
    };
  }, [dispatch]);

  // -------------------------
  // DND Functions
  // -------------------------
  const reorder = (list: TaskCardTypes[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const move = (sourceCol: BoardColumn, destCol: BoardColumn, sourceIndex: number, destIndex: number) => {
    const sourceCards = Array.from(sourceCol.cards);
    const destCards = Array.from(destCol.cards);
    const [removed] = sourceCards.splice(sourceIndex, 1);
    destCards.splice(destIndex, 0, removed);
    return { sourceCards, destCards };
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const colIndex = boards.findIndex((c) => c.id === source.droppableId);
      const newCards = reorder(boards[colIndex].cards, source.index, destination.index);
      const newBoards = boards.map((col, index) =>
        index === colIndex ? { ...col, cards: newCards } : col
      );
      dispatch(setBoards(newBoards));
      return;
    }

    const ticketId = draggableId;
    const newStatusId = destination.droppableId;

    try {
      await api.put(`/Kanban/MoveTicket`, {}, { params: { ticketId, newStatusId } });

      const sourceColIndex = boards.findIndex((c) => c.id === source.droppableId);
      const destColIndex = boards.findIndex((c) => c.id === destination.droppableId);

      const { sourceCards, destCards } = move(
        boards[sourceColIndex],
        boards[destColIndex],
        source.index,
        destination.index
      );

      const newBoards = boards.map((col, index) => {
        if (index === sourceColIndex) return { ...col, cards: sourceCards };
        if (index === destColIndex) return { ...col, cards: destCards };
        return col;
      });

      dispatch(setBoards(newBoards));
    } catch (error) {
      console.error("MoveTicket failed:", error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {/* ------------------------- */}
        {/* TICKET DETAILS MODAL */}
        {/* ------------------------- */}
 <Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title=""
  size="xl"
>
  {selectedCard && (
    <div 
      className="flex gap-8 w-full h-full"
      style={{ 
        fontFamily: "'Inter', system-ui, sans-serif",
        background: "var(--background)",
        color: "var(--text-foreground)",
      }}
    >
      {/* ====================== LEFT: COMMENTS ====================== */}
      <div 
        className="flex-1 overflow-y-auto pr-4"
        style={{ 
          background: "var(--background-secondary)",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          border: "1px solid var(--background-accent)",
          maxHeight: "90vh",
        }}
      >
        {/* Title */}
        <h1 
          className="text-3xl font-bold mb-6 tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {selectedCard.title}
        </h1>

        {/* Description */}
        {selectedCard.description && (
          <div 
            className="p-6 rounded-2xl mb-8 shadow-inner"
            style={{ 
              background: "var(--background)",
              border: "1px solid var(--background-accent)",
              lineHeight: "1.7",
            }}
          >
            <p style={{ color: "var(--text-secondary)" }}>
              {selectedCard.description}
            </p>
          </div>
        )}

        {/* Comments Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">Comments</span>
          <span 
            className="px-3 py-1 text-sm font-medium rounded-full"
            style={{ 
              background: "var(--background-accent)",
              color: "var(--text-muted)"
            }}
          >
            {selectedCard.comments?.length || 0}
          </span>
        </div>

        {/* Add Comment Box */}
        <div 
          className="p-5 rounded-2xl mb-8 shadow-sm border"
          style={{ 
            background: "var(--background)",
            borderColor: "var(--background-accent)",
          }}
        >
          <textarea
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full p-4 rounded-xl resize-none outline-none text-base"
            rows={4}
            style={{ 
              background: "transparent",
              border: "1px solid var(--background-accent)",
              color: "var(--text-foreground)",
            }}
          />
          {commentText && (
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={addComment}
                className="px-6 py-2.5 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all"
                style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}
              >
                Post Comment
              </button>
              <button
                onClick={() => setCommentText("")}
                className="px-5 py-2.5 rounded-xl font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Comments List */}
        <div className="space-y-5">
          {selectedCard.comments?.map((c: Comment) => (
            <div 
              key={c.commentID}
              className="p-5 rounded-2xl shadow-sm border"
              style={{ 
                background: "var(--background)",
                borderColor: "var(--background-accent)",
              }}
            >
              <CommentItem comment={c} userId={userId} onReply={addReply} onDelete={deleteComment} />
            </div>
          ))}
        </div>
      </div>

      {/* ====================== RIGHT: INFO PANEL ====================== */}
      <div 
        className="w-96 overflow-y-auto"
        style={{ 
          background: "var(--background-secondary)",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          border: "1px solid var(--background-accent)",
          maxHeight: "90vh",
        }}
      >
        <h3 className="text-xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
          Ticket Details
        </h3>

        <div className="space-y-5 text-base">
          {selectedCard.createdByName && (
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Creator</span>
              <span className="font-medium">{selectedCard.createdByName}</span>
            </div>
          )}

          {selectedCard.assignedToName && (
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Assigned</span>
              <span className="font-medium">{selectedCard.assignedToName}</span>
            </div>
          )}

          {selectedCard.priorityName && (
            <div className="flex justify-between items-center">
              <span style={{ color: "var(--text-muted)" }}>Priority</span>
              <span 
                className="px-4 py-2 rounded-full text-sm font-bold"
                style={{ 
                  background: selectedCard.priorityName.toLowerCase().includes("high") 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : selectedCard.priorityName.toLowerCase().includes("medium")
                    ? "rgba(251, 191, 36, 0.15)"
                    : "rgba(34, 197, 94, 0.15)",
                  color: selectedCard.priorityName.toLowerCase().includes("high") ? "#dc2626" : 
                         selectedCard.priorityName.toLowerCase().includes("medium") ? "#d97706" : "#16a34a",
                }}
              >
                {selectedCard.priorityName}
              </span>
            </div>
          )}

          {/* Tags */}
          <div>
            <span style={{ color: "var(--text-muted)" }}>Tags</span>
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedCard.tagNames?.length > 0 ? (
                selectedCard.tagNames.map((tag: string, i: number) => (
                  <span 
                    key={i}
                    className="px-4 py-2 rounded-xl text-sm font-medium"
                    style={{ 
                      background: "var(--background-accent)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <span style={{ color: "var(--text-muted)" }}>No tags</span>
              )}
            </div>
          </div>

          {/* Dates */}
          {selectedCard.createdAt && (
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Created</span>
              <span>{new Date(selectedCard.createdAt).toLocaleDateString()}</span>
            </div>
          )}

          {/* Attachments */}
          {selectedCard.attachments?.length > 0 && (
            <div className="mt-8 pt-8 border-t" style={{ borderColor: "var(--background-accent)" }}>
              <h4 className="font-bold mb-4">Attachments ({selectedCard.attachments.length})</h4>
              <div className="space-y-3">
                {selectedCard.attachments.map((att: any) => (
                  <div 
                    key={att.attachmentID}
                    className="p-4 rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer"
                    style={{ 
                      background: "var(--background)",
                      borderColor: "var(--background-accent)",
                    }}
                  >
                    <AttachmentCard attachment={att} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )}
</Modal>


        {/* ------------------------- */}
        {/* KANBAN COLUMNS */}
        {/* ------------------------- */}
        <div style={{ display: "flex", gap: 12 }} >
          {boards.map((column: BoardColumn) => (
            <div key={column.id} >
              <Column title={column.title}>
                <Droppable droppableId={column.id.toString()}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        background: snapshot.isDraggingOver ? "#e3f2fd" : "transparent",
                        padding: 5,
                        borderRadius: 8,
                        minHeight: 40,
                      }}
                    >
                      {column.cards.map((card, index) => (
                        <Draggable draggableId={card.id.toString()} index={index} key={card.id}>
                          {(prov) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              onClick={() => handleCardClick(card)}
                              style={{ marginBottom: 8, ...prov.draggableProps.style }}
                            >
                              <TaskCard task={card} />
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Column>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
