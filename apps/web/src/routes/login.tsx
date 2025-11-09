import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { type FormEvent } from "react";

import { authClient } from "../utils/auth-client";

import { Card, CardHeader, CardContent, CardTitle } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { toast } from "@repo/ui/toast";

export const Route = createFileRoute("/login")({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData({
      queryKey: ["session"],
      queryFn: context.sessionFetcher,
    });
    if (session) throw redirect({ to: "/" });
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: (data) => {
      if (data) {
        const user = data?.user?.name ?? data?.user?.email;
        toast.success(`Welcome back :  ${user}`);
        navigate({ to: "/" });
      }
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Something went wrong!");
      console.error("Login failed:", err);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    loginMutation.mutate({
      email: form.get("email") as string,
      password: form.get("password") as string,
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Create Account</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="email" type="email" placeholder="Email" required />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Loading..." : "Login"}
            </Button>

            <div className="flex flex-col gap-1 items-end">
              {loginMutation.error != null && (
                <p className="text-sm w-full text-red-700 text-center bg-red-200 border border-red-300 rounded-md">
                  {loginMutation.error instanceof Error
                    ? loginMutation.error.message
                    : "Something went wrong!"}
                </p>
              )}
              <p className="text-sm ">
                create account
                <span>
                  <Link className="text-blue-500" to="/register">
                    {" "}
                    here
                  </Link>
                </span>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
