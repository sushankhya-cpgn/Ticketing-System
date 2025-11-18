import { useSelector, useDispatch } from "react-redux";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { setBoards } from "./boardSlice";
import Column from "../../components/Column/Column"
import TaskCard from "../../components/Card/TaskCard";


interface TaskCardTypes {
  id: string;
  content: string;
}

interface BoardColumn {
  id: string;
  title:string;
  cards: TaskCardTypes[]
}

export default function KanbanBoard() {
  const boards = useSelector((s) => s.board.value);
  const dispatch = useDispatch();

  // Reorder the cards in the same column
  const reorder = (list:TaskCardTypes[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  // Move cards between different columns
  const move = (sourceCol:BoardColumn, destCol:BoardColumn, sourceIndex:number, destIndex:number) => {
    const sourceCards = Array.from(sourceCol.cards);
    const destCards = Array.from(destCol.cards);

    const [removed] = sourceCards.splice(sourceIndex, 1);
    destCards.splice(destIndex, 0, removed);

    return { sourceCards, destCards };
  }

  // Handle drag end event
  const onDragEnd = (result:DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    // same column
    if (source.droppableId === destination.droppableId) {
      const colIndex = boards.findIndex((c:BoardColumn) => c.id === source.droppableId);
      const newCards = reorder(boards[colIndex].cards, source.index, destination.index);
      const newBoards = boards.map((col:BoardColumn, index:number) => index === colIndex ? { ...col, cards: newCards } : col);
      dispatch(setBoards(newBoards));
      return;
    }
    // Different Column
    const sourceColIndex = boards.findIndex((c:BoardColumn) => c.id === source.droppableId);
    const destColIndex = boards.findIndex((c:BoardColumn) => c.id === destination.droppableId);
    const { sourceCards, destCards } = move(boards[sourceColIndex], boards[destColIndex], source.index, destination.index);
    const newBoards = boards.map((col:BoardColumn, index:number) => {
      if (index === sourceColIndex) return { ...col, cards: sourceCards };
      if (index === destColIndex) return { ...col, cards: destCards };
      return col;
    })
    dispatch(setBoards(newBoards));
  }

  return (
    <div style={{ padding: 20 }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: 12 }}>
          {boards.map((column:BoardColumn) => (
            <div key={column.id}> {/* FIX: key on wrapper */}
              <Column title={column.title}>
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        background: snapshot.isDraggingOver
                          ? "#e3f2fd"
                          : "transparent",
                        padding: 5,
                        borderRadius: 8,
                        minHeight: 40,
                      }}
                    >
                      {column.cards.map((card, index) => (
                        <Draggable
                          draggableId={card.id}
                          index={index}
                          key={card.id}
                        >
                          {(prov) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              style={{
                                marginBottom: 8,
                                ...prov.draggableProps.style,
                              }}
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
