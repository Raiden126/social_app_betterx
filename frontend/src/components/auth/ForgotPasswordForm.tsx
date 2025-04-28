import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={() => {}}>
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
                    placeholder="Enter your email"
                    required
                  />
                  <Button type="submit" className="w-full">
                    Reset Password
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    Remembered your password?{" "}
                    <Link to="/login" className="text-primary underline">
                      Login
                    </Link>
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