import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import { toast } from "../ui/use-toast";

export function ResetPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      if (!token) {
        setErrorMessage("Invalid or missing token.");
        return;
      }
      const payload = { token, password, newPassword: confirmPassword };
      const response = await authService.resetPassword(payload);
      console.log("Password reset successful:", response);
      setSuccessMessage("Password reset successfully. Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      toast({
        title: "Success",
        description: "Password reset successfully. Redirecting to login...",
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong.");
      toast({
        title: "Error",
        description: err.message || "Failed to reset password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Reset Your Password</h1>
                <p className="text-balance text-muted-foreground">
                  Enter a new password for your account
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Reset Password
              </Button>

              {errorMessage && (
                <div className="text-sm text-red-500 text-center">{errorMessage}</div>
              )}

              {successMessage && (
                <div className="text-sm text-green-500 text-center">{successMessage}</div>
              )}
            </div>
          </form>

          <div className="relative hidden bg-muted md:block">
            <img
              src="/login.avif"
              alt="Reset Password graphic"
              className="absolute inset-0 h-full w-full object-cover brightness-75"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
