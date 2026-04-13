import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/app/routes";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { I18nProvider } from "@/app/providers/I18nProvider";
import { ThemeProvider } from "@/app/providers/ThemeProvider";

export function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
