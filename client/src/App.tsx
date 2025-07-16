import { Outlet } from "react-router-dom"
import Header from "./components/common/header"
import { AuthProvider } from "./context/auth-context"
import { Toaster} from "react-hot-toast"

function App() {
  return (
   <div className="">
    <Toaster/>
    <AuthProvider>
    <Header/>
    <Outlet/>
    </AuthProvider>
   </div>
  )
}

export default App