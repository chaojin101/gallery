import { useAuth } from "@/context/useAuth";
import Link from "next/link";

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-header py-4 flex-col gap-4">
      <div className="flex gap-4 items-center justify-between">
        <Link
          href={"/"}
          className="font-bold text-2xl cursor-pointer hover:scale-[1.05] transition-all"
        >
          GirlIndex
        </Link>

        <div className="ml-auto flex items-center gap-4">
          {user && <p>{user.email}</p>}
          {user && <button onClick={() => logout()}>Logout</button>}
          {!user && <Link href={"/auth/login"}>Login</Link>}
        </div>
      </div>
      <nav className="flex gap-4 items-center">
        <Link
          href={"/"}
          className="font-bold text-xl cursor-pointer hover:scale-[1.05] transition-all"
        >
          Galleries
        </Link>
        <Link
          href={"/collection"}
          className="font-bold text-xl cursor-pointer hover:scale-[1.05] transition-all"
        >
          Collections
        </Link>
      </nav>
    </header>
  );
};
