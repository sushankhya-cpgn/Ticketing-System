import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";
import { toggleTheme, setTheme, type Theme } from "../features/theme/themeslice";

export const useTheme = () => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme);
  const dispatch = useDispatch<AppDispatch>();

  return {
    theme,
    toggleTheme: () => dispatch(toggleTheme()),
    setTheme: (theme: Theme) => dispatch(setTheme(theme)),
  };
};
