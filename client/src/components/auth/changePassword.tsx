import { Label } from "@radix-ui/react-label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { changePassword } from "@/api/auth";
import type { AxiosError } from "axios";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [cnfPass, setCnfPass] = useState("");
  const [loading, setLoading] = useState(false);
  const[myError,setError] = useState("")
  const navigate = useNavigate();
  const params = useParams();
  const token = params.token;

  useEffect(() => {
    if (cnfPass && password !== cnfPass) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  }, [password, cnfPass]);
  
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (password !== cnfPass) {
        throw new Error("Password does not match");
      }
      const response = await changePassword(token as string, cnfPass);
      toast.success(response?.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message = error.response?.data?.message || myError;
      toast.error(message);
    } finally {
      setLoading(false);
      setPassword("");
      setCnfPass("");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Please enter your email</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Confirm Password</Label>
                <Input
                  id="cnfPass"
                     type="password"
                  value={cnfPass}
                  onChange={(e) => setCnfPass(e.target.value)}
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

export default ChangePassword;
