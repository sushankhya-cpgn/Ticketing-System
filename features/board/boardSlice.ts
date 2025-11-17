import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [
    {
      id: "col-1",
      title: "To Do",
      cards: [
        { id: "task-1", content: "Fix bug in login" },
        { id: "task-2", content: "Write unit tests" },
      ],
    },
    {
      id: "col-2",
      title: "In Progress",
      cards: [{ id: "task-3", content: "Create dashboard UI" }],
    },
    {
      id: "col-3",
      title: "Done",
      cards: [{ id: "task-4", content: "Set up CI/CD" }],
    },
  ],
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoards: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setBoards } = boardSlice.actions;
export default boardSlice.reducer;
