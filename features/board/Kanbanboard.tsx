import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import { setBoards } from "./boardSlice";
import Column from "../../components/Column/Column"
import TaskCard from "../../components/Card/TaskCard";

export default function KanbanBoard() {
  const boards = useSelector((s) => s.board.value);
  const dispatch = useDispatch();

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const move = (sourceCol, destCol, sourceIndex, destIndex) => {
    const sourceCards = Array.from(sourceCol.cards);
    const destCards = Array.from(destCol.cards);

    const [removed] = sourceCards.splice(sourceIndex, 1);
    destCards.splice(destIndex, 0, removed);

    return { sourceCards, destCards };
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // same column
    if (source.droppableId === destination.droppableId) {
      const colIndex = boards.findIndex((c) => c.id === source.droppableId);

      const newCards = reorder(
        boards[colIndex].cards,
        source.index,
        destination.index
      );

      const newBoards = boards.map((col, idx) =>
        idx === colIndex ? { ...col, cards: newCards } : col
      );

      dispatch(setBoards(newBoards));
      return;
    }

    // across columns
    const sourceColIndex = boards.findIndex(
      (c) => c.id === source.droppableId
    );
    const destColIndex = boards.findIndex(
      (c) => c.id === destination.droppableId
    );

    const { sourceCards, destCards } = move(
      boards[sourceColIndex],
      boards[destColIndex],
      source.index,
      destination.index
    );

    const newBoards = boards.map((col, idx) => {
      if (idx === sourceColIndex) return { ...col, cards: sourceCards };
      if (idx === destColIndex) return { ...col, cards: destCards };
      return col;
    });

    dispatch(setBoards(newBoards));
  };

  return (
    <div style={{ padding: 20 }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: 12 }}>
          {boards.map((column) => (
            <Droppable droppableId={column.id} key={column.id}>
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
                  }}
                >
                  <Column title={column.title}>
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
                          >
                            <TaskCard task={card} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Column>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
