import { Outlet } from "react-router-dom"
import Header from "./components/common/header"
import { AuthProvider } from "./context/auth-context"
import { Toaster} from "react-hot-toast"
import { ThemeProvider } from "@/components/theme-provider"
 

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Toaster/>
    <AuthProvider>
    <Header/>
    <Outlet/>
    </AuthProvider>
    </ThemeProvider>
  )
}

export default App