import { Button } from "@/components/ui/button"
import { toast } from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import { useState } from "react"
import type { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { handleGoogleSuccess } from "@/api/auth";

export default function Login (){
  const {login} = useAuth();
  const[email,setEmail] = useState("")
  const[password,setPassword] = useState("")
  const[loading,setIsLoading] = useState(false)

  const handleLogin = async () =>{
    setIsLoading(true)
    try{
      const data= await login(email,password)
      toast.success(data?.message)
     setTimeout(()=>{
      window.location.href="/"
     }, 1500)
    }catch(err){
       const error = err as AxiosError<{ message: string }>;
      const message = error.response?.data?.message || "Login failed!";
      toast.error(message);
    }finally{
      setIsLoading(false)
    }
   
  }

const handleGoogleLoginSubmit = async(credentialResponse:CredentialResponse) =>{
  try {
      const res = await handleGoogleSuccess(credentialResponse);
      toast.success(res?.message)
      setTimeout(()=>{
      window.location.href="/"
     }, 1500)
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    const message = error.response?.data?.message || "Login failed!";
    toast.error(message);
  }
}


  return (
        <div className="w-full  mt-10  flex justify-center items-center">
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>

      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password"    value={password}
                onChange={(e)=>setPassword(e.target.value)}required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" onClick={handleLogin} disabled={loading}>
          {loading? "Logging..":"Log in"}
        </Button>
        <div className="w-full">
            <GoogleLogin
              onSuccess={handleGoogleLoginSubmit}
              onError={() => toast.error("Google Login Failed")}
              text="signin_with"
              shape="rectangular"
            />
          </div>
      </CardFooter>
    </Card>
    </div>
  )
}
