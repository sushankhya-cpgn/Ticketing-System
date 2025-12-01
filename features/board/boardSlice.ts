import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { logoutUser } from "../user/authslice"; // adjust path
import { KanBanApi } from "../../src/api/kanbanApi";

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
  // const res = await api.get("/Kanban/Board");
  const res = await KanBanApi.getAll();
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
    })  .addCase(logoutUser.fulfilled, (state) => {
      state.value = [];   // CLEAR BOARD DATA
    });
  },
});

export const { setBoards } = boardSlice.actions;
export default boardSlice.reducer;
