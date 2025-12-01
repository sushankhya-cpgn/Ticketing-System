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
}

interface Comment {
  commentID: number;
  parentCommentID: number | null;
  commentText: string;
  commentedBy: number;
  commentedAt: string;
  replies: Reply[];
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

export default function KanbanBoard() {
  const boards = useSelector((s: RootState) => s.board.value);
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  // ✨ Comment states
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

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

  // -------------------------
  // ADD NEW COMMENT
  // -------------------------
  const addComment = async () => {
    if (!selectedCard) return;
    if (!commentText.trim()) return;

    await TicketApi.addComment({
      ticketId: selectedCard.ticketID ?? selectedCard.id,
      commentText,
    });

    // const updated = await TicketApi.getTicketById(selectedCard.ticketID ?? selectedCard.id);
    const updated = await KanBanApi.getById(selectedCard.ticketID ?? selectedCard.id)
    setSelectedCard(updated.data.data);

    setCommentText("");
  };

  const cancelComment = () => {
    setCommentText("")
  }

  
  // -------------------------
  //Delete Comment
  // -------------------------



  // -------------------------
  // ADD REPLY
  // -------------------------
  const addReply = async (parentID: number) => {
    if (!replyText.trim()) return;

    await TicketApi.addComment({
      ticketId: selectedCard.ticketID ?? selectedCard.id,
      parentCommentID: parentID,
      commentText: replyText,
    });

    // const updated = await TicketApi.getTicketById(selectedCard.ticketID ?? selectedCard.id);
    const updated = await KanBanApi.getById(selectedCard.ticketID ?? selectedCard.id)
    setSelectedCard(updated.data.data);

    setReplyText("");
    setReplyingTo(null);
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
          title="Ticket Details"
          size="xl"
        >
          {selectedCard && (
            <div className="flex  gap-4 w-full">
              {/* LEFT SIDE — DETAILS + COMMENTS */}
              <div className="p-4  w-1/2 h-[700px] overflow-y-auto border border-gray-300 rounded">
                <div>
                  <p className="font-semibold text-lg"> Title: {selectedCard.title}</p>
                </div>

                {selectedCard.description && (
                  <p><strong>Description:</strong> {selectedCard.description}</p>
                )}

                {/* COMMENTS SECTION */}
                <div className="mt-4">
                  <h3 className="font-semibold text-lg mb-2">Comments</h3>

                  {/* ADD NEW COMMENT */}
                  <div className="flex gap-2 mb-4">
                    <TextFieldComponent
                      label="Add a comment"
                      value={commentText}
                      onChange={(e: any) => setCommentText(e.target.value)}
                    />
                  </div>

                  {commentText && (
                    <div className="flex gap-2">
                      <ButtonComponent
                        onClick={addComment}
                        label="Post"
                        sx={{ backgroundColor: "green", ":hover": { backgroundColor: "darkgreen" } }}
                        height="35px"
                      />
                      <BlankButton onClick={cancelComment} label="Cancel" sx={{ color: "red" }} />
                    </div>
                  )}

                  {/* COMMENTS LIST */}
                  <div className="flex flex-col gap-3 mt-2">
                    {selectedCard.comments?.map((c: any) => (
                      // <div key={c.commentID} className="p-3 rounded">
                      //   <p className="font-medium">User {c.commentedByName}</p>
                      //   <p>{c.commentText}</p>

                      //   <button
                      //     className="text-blue-600 text-sm mt-1"
                      //     onClick={() => setReplyingTo(c.commentID)}
                      //   >
                      //     Reply
                      //   </button>

                      //   {replyingTo === c.commentID && (
                      //     <div className="mt-2 flex-col">

                      //       <TextFieldComponent label="Write a reply..." value={replyText} onChange={(e: any) => setReplyText(e.target.value)} ></TextFieldComponent>
                      //       {replyText &&
                      //         <div className=" flex mt-4 gap-2">
                      //           <ButtonComponent onClick={() => addReply(c.commentID)} label="Send" sx={{ backgroundColor: "green", ":hover": { backgroundColor: "darkgreen" } }}
                      //             height="35px"></ButtonComponent>
                      //           <BlankButton label="Cancel" onClick={() => setReplyingTo(null)} sx={{ color: "red" }}></BlankButton>
                      //         </div>
                      //       }
                      //     </div>

                      //   )}

                      //   {/* Replies */}
                      //   <div className="ml-6 mt-2 flex flex-col gap-2">
                      //     {c.replies?.map((r: any) => (
                      //       <div key={r.commentID} className="p-2 rounded">
                      //         <p className="font-medium">User {r.commentedByName}</p>
                      //         <p>{r.commentText}</p>
                      //       </div>
                      //     ))}
                      //   </div>
                      // </div>
                      <div className="border-l-2 border-gray-300 pl-4 ml-2" key={c.commentID}>
  <p className="font-medium">User {c.commentedByName}</p>
  <p>{c.commentText}</p>

  <button
    className="text-blue-600 text-sm mt-1"
    onClick={() => setReplyingTo(c.commentID)}
  >
    Reply
  </button>

  {/* Reply Input */}
  {replyingTo === c.commentID && (
    <div className="mt-2 ml-4">
      <TextFieldComponent
        label="Write a reply..."
        value={replyText}
        onChange={(e: any) => setReplyText(e.target.value)}
      />

      {replyText && (
        <div className="flex gap-2 mt-2">
          <ButtonComponent
            onClick={() => addReply(c.commentID)}
            label="Send"
            height="35px"
          />
          <BlankButton label="Cancel" onClick={() => setReplyingTo(null)} />
        </div>
      )}
    </div>
  )}

  {/* Replies */}
  {c.replies?.length > 0 && (
    <div className="ml-6 mt-3 flex flex-col gap-2 border-l-2 border-gray-200 pl-4">
      {c.replies.map((r: any) => (
        <div key={r.commentID}>
          <p className="font-medium">User {r.commentedByName}</p>
          <p>{r.commentText}</p>
        </div>
      ))}
    </div>
  )}
</div>

                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE — ALSO SCROLLABLE */}
              <div className="w-1/2 h-[500px] overflow-y-auto p-4 border border-gray-300 rounded">
              {selectedCard.createdByName && (
                <p><strong>Assignee:</strong> {selectedCard.createdByName}</p>
              )}
              
                {selectedCard.assignedToName && (
                  <p><strong>Assigned To User:</strong> {selectedCard.assignedToName}</p>
                )}

                {selectedCard.roleName && (
                  <p><strong>Role:</strong> {selectedCard.roleName}</p>
                )}


                {selectedCard.priorityName && (
                  <p><strong>Priority:</strong> {selectedCard.priorityName}</p>
                )}
                <div className="flex gap-2">
                  <p><strong>Tags:</strong></p>
                  {selectedCard.tagNames?.length ? (
                    selectedCard.tagNames.map((tag: any, i: any) => (
                      <span key={i}>{tag}</span>
                    ))
                  ) : (
                    <p>No tags</p>
                  )}
                </div>
                {selectedCard.createdAt && (
                  <p><strong>Created At:</strong> {selectedCard.createdAt}</p>
                )}
                {selectedCard.updatedAt && (
                  <p><strong>Updated At:</strong> {selectedCard.updatedAt}</p>
                )}
                {selectedCard.attachments && (
                
                <div className=" mt-2 grid grid-cols-2">
                  {/* <p className=" mb-2"><strong>Uploaded Attachments</strong></p> */}
                  {selectedCard.attachments.map((att:any)=>
                  <AttachmentCard key={att.id} attachment={{
                    attachmentID:att.attachmentID,
                    url:att.url
                  }} />)}
                  </div>


                )} 
              </div>

            </div>
          )}
        </Modal>


        {/* ------------------------- */}
        {/* KANBAN COLUMNS */}
        {/* ------------------------- */}
        <div style={{ display: "flex", gap: 12 }}>
          {boards.map((column: BoardColumn) => (
            <div key={column.id}>
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
