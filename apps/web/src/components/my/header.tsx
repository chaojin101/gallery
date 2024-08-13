import { useAuth } from "@/context/useAuth";
import Link from "next/link";

export const Header = () => {
  const { tokenPayload, logout } = useAuth();

  return (
    <header className="flex flex-col gap-2">
      <div className="px-4 pt-4 flex gap-4 items-center justify-between">
        <Link
          href={"/"}
          className="font-bold text-2xl cursor-pointer hover:scale-[1.05] transition-all"
        >
          GirlIndex
        </Link>

        <div className="ml-auto flex items-center gap-4">
          {tokenPayload ? (
            <>
              <p>{tokenPayload.email}</p>
              <button onClick={() => logout()}>Logout</button>
            </>
          ) : (
            <>
              <Link href={"/auth/login"}>Login</Link>
              <Link href={"/auth/register"}>Register</Link>
            </>
          )}
        </div>
      </div>
      <nav className="px-4 flex gap-4 items-center bg-slate-600 text-white">
        <Link
          href={"/gallery/latest"}
          className="font-bold text-xl cursor-pointer hover:scale-[1.05] transition-all"
        >
          Gallery
        </Link>
        <Link
          href={"/collection/latest"}
          className="font-bold text-xl cursor-pointer hover:scale-[1.05] transition-all"
        >
          Collection
        </Link>
      </nav>
    </header>
  );
};
