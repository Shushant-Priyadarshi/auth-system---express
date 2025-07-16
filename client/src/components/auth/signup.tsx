import { SignUpUser } from "@/api/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
 

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await SignUpUser(name, email, password);  
      toast.success(response?.data)
      setTimeout(() => navigate("/otp", { state:{email} }), 2000)
    } catch(err) {
      const error = err as AxiosError<{ message: string }>;
      const message = error.response?.data?.message || "Signup failed!";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mt-10 flex justify-center items-center overflow-hidden">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>SignUp to Authify</CardTitle>
          <CardDescription>
            Enter your name, email below to signup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Shushi"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={handleSignUp}
          >
            {loading ? "Submitting..." : "Signup"}
          </Button>
          <Button variant="outline" className="w-full">
            Signup with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
