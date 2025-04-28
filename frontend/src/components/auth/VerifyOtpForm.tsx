import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authService } from "@/services/authService";
import { useToast } from "@/components/ui/use-toast";
import {VerifyOtpFormData} from "@/types/auth";
import { Loader2 } from "lucide-react";
 
export function VerifyOtpForm({ className, email, ...props }: VerifyOtpFormData) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Email not found. Please try registering again.",
        variant: "destructive",
      });
      return;
    }
 
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }
 
    setIsLoading(true);
    try {
      await authService.verifyOtp(otpString, email);
      toast({
        title: "Success",
        description: "Email verified successfully!",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
 
    if (value.length === 1 && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };
 
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };
 
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Verify OTP</h1>
                <p className="text-balance text-muted-foreground">
                  Enter the OTP sent to your email
                </p>
              </div>
 
              <div className="flex justify-between gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    className="w-12 text-center"
                    required
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                <span>
                  Didn't receive the OTP?{" "}
                  <Link to="/resend-otp" className="text-primary underline">
                    Resend OTP
                  </Link>
                </span>
              </p>
            </div>
          </form>
 
          <div className="relative hidden bg-muted md:block">
            <img
              src="/signup.avif"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.9] dark:white"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}