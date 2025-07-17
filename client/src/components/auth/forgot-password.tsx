import { Label } from "@radix-ui/react-label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { useState } from "react";

import { forgotPassword } from "@/api/auth";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { Button } from "../ui/button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = await forgotPassword(email);
      toast.success(data?.message);
      setTimeout(()=>toast("You can close this tab"),2000 )
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message = error.response?.data?.message || "Login failed!";
      toast.error(message);
    } finally {
      setLoading(false);
      setEmail("")
    }
  };

  return (
    <div className="flex justify-center mt-20 ">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Please enter your email</CardTitle>
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading
              ? "Sending Reset link to your email...."
              : "Send reset link to your email"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
