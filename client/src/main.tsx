import { StrictMode } from 'react'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import Login from "./components/auth/login.tsx"
import SignUp from "./components/auth/signup.tsx"
import OtpForm from './components/auth/otp-form.tsx'
import Homepage from './components/page/homepage.tsx'
import RedirectIfAuthenticated from './lib/redirect-If-authenticated.tsx'



const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<App/>}>
    <Route path='/' element={<Homepage/>}></Route>
    <Route path='/signup' element={<RedirectIfAuthenticated><SignUp/></RedirectIfAuthenticated>}></Route>
    <Route path='/login' element={<RedirectIfAuthenticated><Login/></RedirectIfAuthenticated>}></Route>
    <Route path='/otp' element={<RedirectIfAuthenticated><OtpForm/></RedirectIfAuthenticated>}></Route>

  </Route>
))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
