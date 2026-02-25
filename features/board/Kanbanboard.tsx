import { useEffect, useState, type ChangeEvent, useMemo } from "react";
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
  commentedByName?: string;
  commentedAt: string;
  replies: Reply[]
}

interface Comment {
  commentID: number;
  parentCommentID: number | null;
  commentText: string;
  commentedBy: number;
  commentedByName?: string;
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
const DetailRow = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;
  return (
    <div>
      <div style={{ fontSize: 12, opacity: 0.6 }}>{label}</div>
      <div style={{ fontWeight: 500 }}>{value}</div>
    </div>
  );
};

const CommentItem: React.FC<CommentItemProps> = ({ comment, userId, onReply, onDelete }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  return (
    <div className="border-l-2 border-gray-300 pl-4 ml-2 mt-2">
      <p className="font-medium">User {comment.commentedByName}</p>
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
  const [searchTicket, setSearchTicket] = useState("");

  // ✨ Comment states
  const [commentText, setCommentText] = useState("");

  // const debouncedSearch = useDebounce(searchTicket,300);


  const term = searchTicket.toLowerCase();
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

  const handleTicketSearch = async (e: any) => {
    console.log(e.target.value);
    setSearchTicket(e.target.value);
  }



  const addComment = async () => {
    if (!selectedCard) return;
    if (!commentText.trim()) return;

    await TicketApi.addComment({
      ticketId: selectedCard.ticketID ?? selectedCard.id,
      commentText, // top-level comment
    });

    const updated = await KanBanApi.getById(selectedCard.ticketID ?? selectedCard.id);
    setSelectedCard(updated.data.data);
    // const newComment = await TicketApi.addComment({
    //   ticketId: selectedCard.ticketID ?? selectedCard.id,
    //   commentText, // top-level comment
    // });
    // console.log(newComment.data)
    // setSelectedCard((prev: any) => ({
    //   ...prev,
    //   comments: [...prev.comments, commentText]
    // }));
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

  const filteredBoards = useMemo(() => {
    if (!term) return boards;

    return boards.map(column => ({
      ...column,
      cards: column.cards.filter(card =>
        card.content?.toLowerCase().includes(term) ||
        card.description?.toLowerCase().includes(term)
      )
    }));
  }, [boards, term]);

  return (
    <div style={{ padding: 20 }} className=" w-full overflow-x-scroll" >
      <TextFieldComponent label="Search Here" onChange={handleTicketSearch} />
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
              style={{
                display: "flex",
                height: "88vh",
                fontFamily: "'Inter', system-ui, sans-serif",
                color: "var(--text-foreground)",
              }}
            >
              {/* ================= LEFT: WORKSPACE ================= */}
              <div
                style={{
                  flex: 1.4,
                  display: "flex",
                  flexDirection: "column",
                  paddingRight: 28,
                  borderRight: "1px solid var(--background-accent)",
                }}
              >
                {/* Sticky Header */}
                <div
                  style={{
                    paddingBottom: 16,
                    marginBottom: 12,
                  }}
                >
                  <h1 style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.3 }}>
                    {selectedCard.title}
                  </h1>
                </div>

                {/* Scrollable Content */}
                <div style={{ flex: 1, overflowY: "auto", paddingRight: 8 }}>
                  {selectedCard.description && (
                    <div style={{ marginBottom: 24, lineHeight: 1.7, fontSize: 15 }}>
                      {selectedCard.description}
                    </div>
                  )}

                  {/* Comments Section */}
                  <div style={{ marginBottom: 16, fontWeight: 600, fontSize: 16 }}>
                    Comments ({selectedCard.comments?.length || 0})
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    {selectedCard.comments?.map((c: Comment) => (
                      <CommentItem
                        key={c.commentID}
                        comment={c}
                        userId={userId}
                        onReply={addReply}
                        onDelete={deleteComment}
                      />
                    ))}
                  </div>
                </div>

                {/* Action Area (Anchored Input) */}
                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 12,
                    borderTop: "1px solid var(--background-accent)",
                  }}
                >
                  <textarea
                    placeholder="Write a comment…"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: 10,
                      border: "1px solid var(--background-accent)",
                      resize: "none",
                      fontSize: 14,
                    }}
                  />
                  {commentText && (
                    <div className="flex justify-end gap-3 mt-2">
                      <button onClick={addComment}>Post</button>
                      <button onClick={() => setCommentText("")}>Cancel</button>
                    </div>
                  )}
                </div>
              </div>

              {/* ================= RIGHT: SYSTEM PANEL ================= */}
              <div
                style={{
                  width: 320,
                  paddingLeft: 28,
                  overflowY: "auto",
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18 }}>
                  Ticket Details
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <DetailRow label="Creator" value={selectedCard.createdByName} />
                  <DetailRow label="Assigned" value={selectedCard.assignedToName} />
                  <DetailRow label="Priority" value={selectedCard.priorityName} />
                  <DetailRow
                    label="Created"
                    value={new Date(selectedCard.createdAt).toLocaleDateString()}
                  />

                  {/* Tags */}
                  <div>
                    <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6 }}>Tags</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {selectedCard.tagNames?.length > 0 ? (
                        selectedCard.tagNames.map((tag: string, i: number) => (
                          <span
                            key={i}
                            style={{
                              padding: "4px 10px",
                              borderRadius: 8,
                              border: "1px solid var(--background-accent)",
                              fontSize: 12,
                            }}
                          >
                            #{tag}
                          </span>
                        ))
                      ) : (
                        <span style={{ opacity: 0.6 }}>No tags</span>
                      )}
                    </div>
                  </div>

                  {/* Attachments */}
                  {selectedCard.attachments?.length > 0 && (
                    <div>
                      <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6 }}>
                        Attachments ({selectedCard.attachments.length})
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {selectedCard.attachments.map((att: any) => (
                          <AttachmentCard key={att.attachmentID} attachment={att} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>

        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          {filteredBoards.map((column: BoardColumn) => {

            return (<div
              key={column.id}
              style={{
                minWidth: 320,
                maxWidth: 320,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                maxHeight: "calc(100vh - 140px)", // makes board height controlled
              }}
            >
              {/* COLUMN CONTAINER */}
              <div
                style={{
                  background: "var(--background-secondary)",
                  borderRadius: 16,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  overflow: "hidden",
                  border: "1px solid var(--background-accent)",
                }}
              >
                {/* COLUMN HEADER */}
                <div
                  style={{
                    padding: "14px 16px",
                    fontWeight: 600,
                    fontSize: 15,
                    letterSpacing: 0.3,
                    position: "sticky",
                    top: 0,
                    background: "var(--background-secondary)",
                    zIndex: 2,
                    borderBottom: "1px solid var(--background-accent)",
                  }}
                >
                  {column.title}
                  <span style={{ marginLeft: 8, opacity: 0.6 }}>
                    ({column.cards.length})
                  </span>
                </div>

                {/* TASK LIST AREA */}
                <Droppable droppableId={column.id.toString()}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        padding: 12,
                        overflowY: "auto",
                        flex: 1,
                        transition: "box-shadow 0.2s ease",
                        boxShadow: snapshot.isDraggingOver
                          ? "inset 0 0 0 2px var(--background-accent)"
                          : "none",
                      }}
                    >
                      {column.cards.map((card, index) => {

                        return (
                          <Draggable
                            draggableId={card.id.toString()}
                            index={index}
                            key={card.id}
                          >
                            {(prov) => (
                              <div
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                                onClick={() => handleCardClick(card)}
                                style={{
                                  marginBottom: 10,
                                  borderRadius: 14,
                                  transition: "transform 0.15s ease",
                                  cursor: "pointer",
                                  ...prov.draggableProps.style,
                                }}
                                onMouseEnter={(e) =>
                                (e.currentTarget.style.transform =
                                  "translateY(-2px)")
                                }
                                onMouseLeave={(e) =>
                                (e.currentTarget.style.transform =
                                  "translateY(0px)")
                                }
                              >
                                <TaskCard task={card} />
                              </div>
                            )}
                          </Draggable>
                        );
                      })}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>)
          })}
        </div>

      </DragDropContext>
    </div>
  );
}
