// // import { useSelector, useDispatch } from "react-redux";
// // import {
// //   DragDropContext,
// //   Droppable,
// //   Draggable,
// //   type DropResult,
// // } from "@hello-pangea/dnd";
// // import { setBoards } from "./boardSlice";
// // import Column from "../../components/Column/Column"
// // import TaskCard from "../../components/Card/TaskCard";
// // import { type RootState } from "../../app/store";


// // interface TaskCardTypes {
// //   id: string;
// //   content: string;
// // }

// // interface BoardColumn {
// //   id: string;
// //   title:string;
// //   cards: TaskCardTypes[]
// // }

// // export default function KanbanBoard() {
// //   const boards = useSelector((s:RootState) => s.board.value);
// //   const dispatch = useDispatch();

// //   // Reorder the cards in the same column
// //   const reorder = (list:TaskCardTypes[], startIndex: number, endIndex: number) => {
// //     const result = Array.from(list);
// //     const [removed] = result.splice(startIndex, 1);
// //     result.splice(endIndex, 0, removed);
// //     return result;
// //   }

// //   // Move cards between different columns
// //   const move = (sourceCol:BoardColumn, destCol:BoardColumn, sourceIndex:number, destIndex:number) => {
// //     const sourceCards = Array.from(sourceCol.cards);
// //     const destCards = Array.from(destCol.cards);

// //     const [removed] = sourceCards.splice(sourceIndex, 1);
// //     destCards.splice(destIndex, 0, removed);

// //     return { sourceCards, destCards };
// //   }

// //   // Handle drag end event
// //   const onDragEnd = (result:DropResult) => {
// //     const { source, destination } = result;
// //     if (!destination) return;

// //     // same column
// //     if (source.droppableId === destination.droppableId) {
// //       const colIndex = boards.findIndex((c:BoardColumn) => c.id === source.droppableId);
// //       const newCards = reorder(boards[colIndex].cards, source.index, destination.index);
// //       const newBoards = boards.map((col:BoardColumn, index:number) => index === colIndex ? { ...col, cards: newCards } : col);
// //       dispatch(setBoards(newBoards));
// //       return;
// //     }
// //     // Different Column
// //     const sourceColIndex = boards.findIndex((c:BoardColumn) => c.id === source.droppableId);
// //     const destColIndex = boards.findIndex((c:BoardColumn) => c.id === destination.droppableId);
// //     const { sourceCards, destCards } = move(boards[sourceColIndex], boards[destColIndex], source.index, destination.index);
// //     const newBoards = boards.map((col:BoardColumn, index:number) => {
// //       if (index === sourceColIndex) return { ...col, cards: sourceCards };
// //       if (index === destColIndex) return { ...col, cards: destCards };
// //       return col;
// //     })
// //     dispatch(setBoards(newBoards));
// //   }

// //   return (
// //     <div style={{ padding: 20 }}>
// //       <DragDropContext onDragEnd={onDragEnd}>
// //         <div style={{ display: "flex", gap: 12 }}>
// //           {boards.map((column:BoardColumn) => (
// //             <div key={column.id}> {/* FIX: key on wrapper */}
// //               <Column title={column.title}>
// //                 <Droppable droppableId={column.id}>
// //                   {(provided, snapshot) => (
// //                     <div
// //                       ref={provided.innerRef}
// //                       {...provided.droppableProps}
// //                       style={{
// //                         background: snapshot.isDraggingOver
// //                           ? "#e3f2fd"
// //                           : "transparent",
// //                         padding: 5,
// //                         borderRadius: 8,
// //                         minHeight: 40,
// //                       }}
// //                     >
// //                       {column.cards.map((card, index) => (
// //                         <Draggable
// //                           draggableId={card.id}
// //                           index={index}
// //                           key={card.id}
// //                         >
// //                           {(prov) => (
// //                             <div
// //                               ref={prov.innerRef}
// //                               {...prov.draggableProps}
// //                               {...prov.dragHandleProps}
// //                               style={{
// //                                 marginBottom: 8,
// //                                 ...prov.draggableProps.style,
// //                               }}
// //                             >
// //                               <TaskCard task={card} />
// //                             </div>
// //                           )}
// //                         </Draggable>
// //                       ))}

// //                       {provided.placeholder}
// //                     </div>
// //                   )}
// //                 </Droppable>
// //               </Column>
// //             </div>
// //           ))}
// //         </div>
// //       </DragDropContext>
// //     </div>
// //   );



// // }


// import { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
// import { setBoards, fetchBoards } from "./boardSlice";
// import Column from "../../components/Column/Column";
// import TaskCard from "../../components/Card/TaskCard";
// import {  type RootState } from "../../app/store";
// import connection, { startConnection } from "../../src/services/signalR/connection";

// interface TaskCardTypes {
//   id: string;
//   content: string;
//   description?: string;
//   priority?: string;
//   assignedTo?: string;
//   createdBy?: string;
//   tags?: string[];
// }

// interface BoardColumn {
//   id: string;
//   title: string;
//   cards: TaskCardTypes[];
// }

// export default function KanbanBoard() {
//   const boards = useSelector((s: RootState) => s.board.value);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(fetchBoards());
//     startConnection();
//   }, [dispatch]);

//   const reorder = (list: TaskCardTypes[], startIndex: number, endIndex: number) => {
//     const result = Array.from(list);
//     const [removed] = result.splice(startIndex, 1);
//     result.splice(endIndex, 0, removed);
//     return result;
//   };

//   const move = (sourceCol: BoardColumn, destCol: BoardColumn, sourceIndex: number, destIndex: number) => {
//     const sourceCards = Array.from(sourceCol.cards);
//     const destCards = Array.from(destCol.cards);
//     const [removed] = sourceCards.splice(sourceIndex, 1);
//     destCards.splice(destIndex, 0, removed);
//     return { sourceCards, destCards };
//   };

//   const onDragEnd = (result: DropResult) => {
//     const { source, destination } = result;
//     if (!destination) return;

//     if (source.droppableId === destination.droppableId) {
//       const colIndex = boards.findIndex((c) => c.id === source.droppableId);
//       const newCards = reorder(boards[colIndex].cards, source.index, destination.index);
//       const newBoards = boards.map((col, index) =>
//         index === colIndex ? { ...col, cards: newCards } : col
//       );
//       dispatch(setBoards(newBoards));
//       return;
//     }

//     const sourceColIndex = boards.findIndex((c) => c.id === source.droppableId);
//     const destColIndex = boards.findIndex((c) => c.id === destination.droppableId);
//     const { sourceCards, destCards } = move(
//       boards[sourceColIndex],
//       boards[destColIndex],
//       source.index,
//       destination.index
//     );
//     const newBoards = boards.map((col, index) => {
//       if (index === sourceColIndex) return { ...col, cards: sourceCards };
//       if (index === destColIndex) return { ...col, cards: destCards };
//       return col;
//     });
//     dispatch(setBoards(newBoards));
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <DragDropContext onDragEnd={onDragEnd}>
//         <div style={{ display: "flex", gap: 12 }}>
//           {boards.map((column: BoardColumn) => (
//             <div key={column.id}>
//               <Column title={column.title}>
//                 <Droppable droppableId={column.id}>
//                   {(provided, snapshot) => (
//                     <div
//                       ref={provided.innerRef}
//                       {...provided.droppableProps}
//                       style={{
//                         background: snapshot.isDraggingOver ? "#e3f2fd" : "transparent",
//                         padding: 5,
//                         borderRadius: 8,
//                         minHeight: 40,
//                       }}
//                     >
//                       {column.cards.map((card, index) => (
//                         <Draggable draggableId={card.id} index={index} key={card.id}>
//                           {(prov) => (
//                             <div
//                               ref={prov.innerRef}
//                               {...prov.draggableProps}
//                               {...prov.dragHandleProps}
//                               style={{ marginBottom: 8, ...prov.draggableProps.style }}
//                             >
//                               <TaskCard task={card} />
//                             </div>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                     </div>
//                   )}
//                 </Droppable>
//               </Column>
//             </div>
//           ))}
//         </div>
//       </DragDropContext>
//     </div>
//   );
// }
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { setBoards, fetchBoards } from "./boardSlice";
import Column from "../../components/Column/Column";
import TaskCard from "../../components/Card/TaskCard";
import { type AppDispatch, type RootState } from "../../app/store";
import api from "../../src/api/axiosClient";
import connection, { startConnection } from "../../src/services/signalR/connection";
import { HubConnectionState } from "@microsoft/signalr";

interface TaskCardTypes {
  id: string;
  content: string;
}

interface BoardColumn {
  id: string;     // statusId
  title: string;
  cards: TaskCardTypes[];
}

export default function KanbanBoard() {
  const boards = useSelector((s: RootState) => s.board.value);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchBoards());
    startConnection();

    // Listen for updates from SignalR
    connection.on("TicketMoved", ({ TicketId, NewStatusId }) => {
  // Re-fetch boards from API
  dispatch(fetchBoards());
});

    // return () => {
    //   if (connection.state === HubConnectionState.Connected) {
    //     connection.off("ReceiveCardUpdate");
    //     connection.stop();
    //   }
    // };
    return () => {
    connection.off("TicketMoved"); 
    if (connection.state === HubConnectionState.Connected) {
      connection.stop();
    }
  };
  }, [dispatch]);

  // reorder function
  const reorder = (list: TaskCardTypes[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // move between columns
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

    // same column movement
    if (source.droppableId === destination.droppableId) {
      const colIndex = boards.findIndex((c) => c.id === source.droppableId);
      const newCards = reorder(boards[colIndex].cards, source.index, destination.index);

      const newBoards = boards.map((col, index) =>
        index === colIndex ? { ...col, cards: newCards } : col
      );

      dispatch(setBoards(newBoards));
      return;
    }

    // Different column (API + real-time)
    const ticketId = draggableId;
    const newStatusId = destination.droppableId;

    try {
      // 1️⃣ Move using API
      await api.put(
  `/Kanban/MoveTicket`,
  {},
  {
    params: {
      ticketId: ticketId,
      newStatusId: newStatusId,
    },
  }
);

      // 2️⃣ Local optimistic update
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
