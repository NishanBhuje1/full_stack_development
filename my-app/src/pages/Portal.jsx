import { Link, Outlet } from "react-router";
import AuthTitle from "../components/AuthTitle";
export default function Portal() {
  return (
    <div className="flex flex-col gap-2 items-center">
      <AuthTitle text="Welcome to Portal" />

      <Link
        className="bg-amber-500 px-3 py-2 inLine-block text-white rounded-lg"
        to="/register"
      >
        Register
      </Link>
    </div>
  );
}
