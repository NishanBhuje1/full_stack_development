import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import AuthTitle from "../components/AuthTitle";
import AuthBox from "../components/AuthBox";
import { useState } from "react";
import { Link } from "react-router";

const schema = yup.object({
  emailAddress: yup
    .string()
    .required("Email address is required")
    .email("Invalid email format"),
  password: yup.string().required("Password is required"),
});
export function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [titleText, setTitleText] = useState("Sign in to your account");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      emailAddress: "",
      password: "Nishan@1234",
    },
  });

  const onSubmit = (data) => console.log(data);
  // Handle form submission logic here

  return (
    <div className="flex flex-col items-center w-full">
      <AuthTitle text={titleText} />
      <AuthBox>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Email address</label>
            <input
              className="border p-1 border-grey-300 rounded-sm"
              type="text"
              id="emailAddress"
              {...register("emailAddress", { required: true })}
            ></input>
            {errors.emailAddress && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label
              onClick={() => setShowPassword(!showPassword)}
              className="font-semibold"
            >
              Password
            </label>
            <input
              className="border p-1 border-grey-300 rounded-sm"
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password", { required: true })}
            ></input>
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password.message}</p>
            )}
          </div>
          <Link to="/forgot-password" className="text-amber-500">
            Forgot password?
          </Link>
          <button className="bg-amber-500 px-3 py-2 inLine-block text-white rounded-lg">
            Sign in
          </button>
        </form>
      </AuthBox>
      <p>
        Don't have an account?{" "}
        <Link to="/register" className="font-bold text-amber-500">
          Register
        </Link>
      </p>
    </div>
  );
}
