import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ForgotPasswordFormProps } from "@/types/auth";
import { authService } from "@/services/authService";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "../ui/use-toast";

export function ForgotPasswordForm({
  className,
  onBack,
  ...props
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!email) {
      setErrorMessage("Please enter your email or username.");
      return;
    }
    if (email && !validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      const payload = { email };
      const response = await authService.forgotPassword(payload);
      console.log("Forgot password successful:", response);
      toast({
        title: "Success",
        description: "Password reset link sent to your email."
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong.");
      toast({
        title: "Error",
        description: err.message || "Failed to send reset link.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Forgot Password</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your email to reset your password
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                <Button type="submit" className="w-full">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
                </Button>
                {errorMessage && (
                  <div className="text-sm text-red-500 text-center">{errorMessage}</div>
                )}
                <p className="text-sm text-center text-muted-foreground">
                  Remembered your password?{" "}
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full mt-2"
                    onClick={onBack}
                  >
                    Back To Login
                  </Button>
                </p>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/login.avif"
              alt="Login graphic"
              className="absolute inset-0 h-full w-full object-cover brightness-75"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
