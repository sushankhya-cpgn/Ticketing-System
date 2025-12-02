import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/user/authslice";
import themeReducer from "../features/theme/themeslice";
import boardReducer from "../features/board/boardSlice";

const store = configureStore({
    reducer: {
    auth: authReducer,theme: themeReducer, board: boardReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;