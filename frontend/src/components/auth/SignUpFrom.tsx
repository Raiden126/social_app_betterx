import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { Github, Loader2, ShieldCheck } from "lucide-react"
import { authService } from "@/services/authService"
import { useToast } from "@/components/ui/use-toast"
import { VerifyOtpForm } from "./VerifyOtpForm"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showVerifyOtp, setShowVerifyOtp] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)
    const { username, firstname, lastname, email, password, confirmPassword } = formData;

    if (email && !validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if(password.length > 15) {
      setErrorMessage("Password must be less than 15 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return
    }

    try {
      setLoading(true)
      const payload = {username, firstname, lastname, email, password, confirmPassword}
      await authService.register(payload);
      toast({
        title: "Success",
        description: "Registration successful! Please check your email for OTP.",
      });
      setRegisteredEmail(email);
      setShowVerifyOtp(true);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to register",
        variant: "destructive",
      });
      setErrorMessage(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  if (showVerifyOtp) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <VerifyOtpForm email={registeredEmail} />
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-balance text-muted-foreground">
                  Join Acme Inc to unlock all features
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="john_doe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="firstname">Firstname</Label>
                <Input
                  id="firstname"
                  name="firstname"
                  type="text"
                  placeholder="john"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lastname">Lastname</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  type="text"
                  placeholder="doe"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Sign Up"
                )}
              </Button>

              {errorMessage && (
                <div className="text-sm text-red-500 text-center">{errorMessage}</div>
              )}

              <div className="relative flex items-center justify-center">
                <div className="absolute left-0 right-0 border-t" />
                <span className="bg-background px-2 text-muted-foreground text-xs uppercase z-10">
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={authService.googleLogin}
                  disabled={loading}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={authService.githubLogin}
                  disabled={loading}
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </div>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
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
  )
}
