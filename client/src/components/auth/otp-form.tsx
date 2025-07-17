import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "../ui/button";
import { verifyOTP } from "@/api/auth";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

const OtpForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);


  const handleVerify = async() =>{
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      if(!email){
        throw new Error("Email is missing")
      }
      const response = await verifyOTP(email,otp);
      toast.success(response?.message)
      setTimeout(() => navigate("/login", { state:{email} }), 1500)
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message = error.response?.data?.message || "Signup failed!";
      toast.error(message); 
    }finally{
      setLoading(false)
    }
   
  }

  return (
    <div className="w-full mt-16 flex justify-center items-center px-4">
      <div className="flex flex-col items-center gap-6 p-6 rounded-xl shadow-lg max-w-md w-full ">
        {/* Message */}
        <p className="text-center text-muted-foreground text-sm md:text-base">
          We've sent a 6-digit verification code to your email.
        </p>

        {/* OTP Input */}
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

         <Button onClick={handleVerify} disabled={loading || otp.length !== 6}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </div>
    </div>
  )
}

export default OtpForm
