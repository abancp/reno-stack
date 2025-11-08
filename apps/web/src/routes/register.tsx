import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { type FormEvent } from "react";

import { authClient } from "../utils/auth-client";

import { Card, CardHeader, CardContent, CardTitle } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { toast } from "@repo/ui/toast";

export const Route = createFileRoute("/register")({
    beforeLoad: async ({ context }) => {
        const session = await context.queryClient.ensureQueryData({
            queryKey: ["session"],
            queryFn: context.sessionFetcher,
        });
        if (session) throw redirect({ to: "/" });
    },
    component: RegisterPage,
});

function RegisterPage() {
    const navigate = useNavigate();

    const registerMutation = useMutation({
        mutationFn: async (data: { name: string; email: string; password: string, confirmPassword: string }) => {
            if (data.password !== data.confirmPassword) throw new Error("Confirm password is not matching")
            const result = await authClient.signUp.email({
                email: data.email,
                password: data.password,
                name: data.name,
            });
            if (result.error) throw new Error(result.error.message)
            return result.data
        },
        onSuccess: (data) => {
            if (data) {
                const user = data?.user?.name ?? data?.user?.email
                toast.success(`User registered :  ${user}`,)
                navigate({ to: "/" });
            }
        },
        onError: (err: unknown) => {
            toast.error(err instanceof Error ? err.message : "Something went wrong!")
            console.error("Registration failed:", err);
        },
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);

        registerMutation.mutate({
            name: form.get("name") as string,
            email: form.get("email") as string,
            password: form.get("password") as string,
            confirmPassword: form.get("confirmPassword") as string
        });
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input name="name" type="text" placeholder="Full Name" required />
                        <Input name="email" type="email" placeholder="Email" required />
                        <Input name="password" type="password" placeholder="Password" required />
                        <Input name="confirmPassword" type="password" placeholder="Confirm Password" required />

                        <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                            {registerMutation.isPending ? "Creating..." : "Register"}
                        </Button>
                        <div className="flex flex-col gap-1 items-end">

                            {registerMutation.error != null && (
                                <p className="text-sm w-full text-red-700 text-center bg-red-200 border border-red-300 rounded-md">
                                    {registerMutation.error instanceof Error ? registerMutation.error.message : "Something went wrong!"}
                                </p>
                            )}
                            <p className="text-sm ">
                                already have account
                                <span>
                                    <Link className="text-blue-500" to="/login" > login here</Link>
                                </span>
                            </p>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
