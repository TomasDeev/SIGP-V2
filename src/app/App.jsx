import {
  JumboDialog,
  JumboDialogProvider,
  JumboTheme,
} from "@jumbo/components";
import JumboRTL from "@jumbo/components/JumboRTL/JumboRTL";
import { CssBaseline } from "@mui/material";
import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { AppProvider } from "./_components";
import { AppSnackbar } from "./_components/_core";
import { AuthProvider } from "./_components/_core/AuthProvider";
import { CONFIG } from "./_config";
import { router } from "./_routes";
import { Spinner } from "./_shared/Spinner";
import { SupabaseProvider } from "./_shared/contexts/SupabaseContext";

function App() {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <AppProvider>
          <JumboTheme init={CONFIG.THEME}>
            <CssBaseline />
            <Suspense fallback={<Spinner />}>
              <JumboRTL>
                <JumboDialogProvider>
                  <JumboDialog />
                  <AppSnackbar>
                    <RouterProvider router={router} />
                  </AppSnackbar>
                </JumboDialogProvider>
              </JumboRTL>
            </Suspense>
          </JumboTheme>
        </AppProvider>
      </AuthProvider>
    </SupabaseProvider>
  );
}

export default App;
