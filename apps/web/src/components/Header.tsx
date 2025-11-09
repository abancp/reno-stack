import { Button } from "@repo/ui/button";
import { useSession } from "../utils/auth-client";
import { Spinner } from "@repo/ui/spinner";
import { Link } from "@tanstack/react-router";

function Header() {
  const { data: session, isPending } = useSession();

  return (
    <div className="flex w-full bg-gray-200 h-12  items-center justify-between px-5 fixed top-0 left-0">
      <Link to="/">
        <h1 className="text-gray-800 font-bold ">Todo App</h1>
      </Link>
      {isPending ? (
        <Spinner />
      ) : session?.session ? (
        <Link to="/profile">
          <h3>{session?.user.name}</h3>
        </Link>
      ) : (
        <div className="flex gap-2">
          <Link to="/login">
            <Button className="h-8">Login</Button>
          </Link>
          <Link to="/register">
            <Button className="h-8">Register</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
