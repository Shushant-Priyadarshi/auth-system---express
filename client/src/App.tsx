import { Outlet } from "react-router-dom";
import Header from "./components/common/header";
import { AuthProvider } from "./context/auth-context";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      <GoogleOAuthProvider clientId={clientId}>
        <AuthProvider>
          <Header />
          <Outlet />
        </AuthProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;
