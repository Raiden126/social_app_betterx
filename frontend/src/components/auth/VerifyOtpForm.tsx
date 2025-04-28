import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "@/services/authService";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const { Title, Text } = Typography;

export const VerifyOtpForm = () => {
  const { toast } = useToast();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleVerify = async () => {
    setErrorMessage(null);
    if (!otp || otp.length !== 6) {
        setErrorMessage("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await authService.verifyOtp(otp, email);
      toast({
        title: "Success",
        description: "Email verified successfully!",
      });
      navigate("/");
    } catch (error: any) {
         setErrorMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      await authService.resendOtp(email);
      setCountdown(300); // Reset countdown
        toast({
          title: "Success",
          description: "OTP resent successfully!",
        });
    } catch (error: any) {
         setErrorMessage(error.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {errorMessage && (
          <div className="text-sm text-red-500 text-center">{errorMessage}</div>
        )}
        <Title level={2} className="text-center">
          Verify Your Email
        </Title>
        <Text className="block text-center">
          We've sent a 6-digit OTP to {email}
        </Text>

        <div className="space-y-4">
          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="text-center text-xl tracking-widest"
          />

          <div className="text-center">
            <Text type={countdown === 0 ? "danger" : "secondary"}>
              OTP expires in: {formatTime(countdown)}
            </Text>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={handleVerify}
            disabled={!otp || otp.length !== 6 || countdown === 0}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
          </Button>

          <Button
            type="link"
            onClick={handleResendOtp}
            loading={resendLoading}
            disabled={countdown > 0}
            className="w-full"
          >
            {resendLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Resend OTP"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};