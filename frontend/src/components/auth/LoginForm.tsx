import { useState, FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { authService } from "@/services/authService";
import { Github, Loader2, ShieldCheck } from "lucide-react";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { toast } from "../ui/use-toast";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!email && !username) {
      setErrorMessage("Please enter your email or username.");
      return;
    }
    if (email && !validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      const payload = { username, email, password };
      const response = await authService.login(payload);
      console.log("Login successful:", response);
      toast({
        title: "Success",
        description: 'Login successful',
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
      setErrorMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!showForgotPassword ? (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8" onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-balance text-muted-foreground">
                      Login to your Acme Inc account
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="emailOrUsername">Email or Username</Label>
                    <Input
                      id="emailOrUsername"
                      type="text"
                      value={email || username}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v.includes("@")) {
                          setEmail(v);
                          setUsername("");
                        } else {
                          setUsername(v);
                          setEmail("");
                        }
                      }}
                      placeholder="john@example.com or your username"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <button
                      type="button"
                      className="ml-auto text-sm underline-offset-2 hover:underline text-blue-600"
                      onClick={() => setShowForgotPassword(true)}
                      >
                      Forgot your password?
                    </button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="password"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Login"}
                  </Button>

                  {errorMessage && (
                    <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                  )}

                  <div className="relative text-center text-sm">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                    <div className="absolute inset-0 top-1/2 border-t border-border"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={authService.googleLogin}
                    >
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={authService.githubLogin}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </div>

                  <div className="text-center text-sm">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="underline underline-offset-4">
                      Sign up
                    </Link>
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
      ) : (
        <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
      )}
    </>
  );
}
//login
