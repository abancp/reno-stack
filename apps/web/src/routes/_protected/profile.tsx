import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useSession, authClient } from "../../utils/auth-client";

import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { toast } from "@repo/ui/toast";
import Header from "../../components/Header";

export const Route = createFileRoute("/_protected/profile")({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData({
      queryKey: ["session"],
      queryFn: context.sessionFetcher,
    });
    if (!session) throw redirect({ to: "/login" });
  },
  component: ProfilePage,
});

function ProfilePage() {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const user = session?.user;

  if (!user) return null;

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
    navigate({ to: "/" });
  };

  return (
    <div className="flex justify-center pt-12 items-center min-h-screen p-6 bg-background">
      <Header />
      <Card className="w-full max-w-md border shadow-sm">
        <CardHeader className="flex flex-col items-center space-y-3">
          <CardTitle className="text-xl font-semibold">
            {user.name || "Unnamed User"}
          </CardTitle>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <div className="text-sm text-muted-foreground">
            <p>Welcome to todo list profile</p>
          </div>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
