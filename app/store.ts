import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/user/authslice";
import themeReducer from "../features/theme/themeslice";

const store = configureStore({
    reducer: {
    auth: authReducer,themeReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;