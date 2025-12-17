import { Outlet, Link } from "react-router";

export function AuthLayout() {
  return (
    <div className="flex flex-col justify-center h-dvh bg-gray-50  items-center">
      <div className="w=[480px] flex flex-col gap-4">
        <Link to="/">
          <img src="https://www.skilluplabs.com.au/bg_gray_logo_horizontal.png"></img>
        </Link>
        <Outlet />
      </div>
    </div>
  );
}
