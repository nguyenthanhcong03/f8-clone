"use client";

import { store } from "@/store/store";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import ThemeProvider from "@/theme/ThemeProvider";
import GlobalSnackbar from "@/components/common/GlobaSnackbar/GlobalSnackbar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <CssBaseline />
        <GlobalSnackbar />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
