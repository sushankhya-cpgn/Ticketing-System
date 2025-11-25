// import { createSlice,type PayloadAction } from "@reduxjs/toolkit";


// export interface TaskCardTypes {
//   id: string;
//   content: string;
// }

// export interface BoardColumn {
//   id: string;
//   title: string;
//   cards: TaskCardTypes[];
// }

// // interface BoardState {
// //   value: BoardColumn[];
// // }

// const initialState = {
//   value: [
//     {
//       id: "col-1",
//       title: "To Do",
//       cards: [
//         { id: "task-1", content: "Fix bug in login" },
//         { id: "task-2", content: "Write unit tests" },
//       ],
//     },
//     {
//       id: "col-2",
//       title: "In Progress",
//       cards: [{ id: "task-3", content: "Create dashboard UI" }],
//     },
//     {
//       id: "col-3",
//       title: "Done",
//       cards: [{ id: "task-4", content: "Set up CI/CD" }],
//     },
//   ],
// };

// const boardSlice = createSlice({
//   name: "board",
//   initialState,
//   reducers: {
//     setBoards: (state, action:PayloadAction<BoardColumn[]>) => {
//       state.value = action.payload;
//     },
//   },
// });

// export const { setBoards } = boardSlice.actions;
// export default boardSlice.reducer;


import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../src/api/axiosClient";

interface TaskCardTypes {
  id: string;
  content: string;
  description?: string;
  priority?: string;
  assignedTo?: string;
  createdBy?: string;
  tags?: string[];
}

interface BoardColumn {
  id: string;
  title: string;
  cards: TaskCardTypes[];
}

interface BoardState {
  value: BoardColumn[];
}

const initialState: BoardState = { value: [] };

// Async thunk to fetch boards
export const fetchBoards = createAsyncThunk("board/fetchBoards", async () => {
  const res = await api.get("/Kanban/Board");
  // Transform API data to our BoardColumn format
  return res.data.data.map((col: any) => ({
    id: col.statusID.toString(),
    title: col.statusName,
    cards: col.cards.map((c: any) => ({
      id: c.ticketId.toString(),
      content: c.tickeTitle,
      description: c.ticketDescription,
      priority: c.ticketPriority,
      assignedTo: c.assignedTo,
      createdBy: c.createdBy,
      tags: c.tags,
    })),
  }));
});

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoards: (state, action: PayloadAction<BoardColumn[]>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoards.fulfilled, (state, action) => {
      state.value = action.payload;
    });
  },
});

export const { setBoards } = boardSlice.actions;
export default boardSlice.reducer;
