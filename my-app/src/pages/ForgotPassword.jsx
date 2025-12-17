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
export function ForgotPassword() {
  const [titleText, setTitleText] = useState("Forgot your password?");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      emailAddress: "",
    },
  });

  const onSubmit = (data) => console.log(data);
  // Handle form submission logic here

  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <AuthTitle text={titleText} />
      <p className="flex flex-col items-center w-full">
        Please enter your emailAddress. You will reeive a reset link to reset
        your password.
      </p>
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
          <button className="bg-amber-500 px-3 py-2 inLine-block text-white rounded-lg">
            Send Reset Link
          </button>
        </form>
      </AuthBox>
      <p>
        Back to{" "}
        <Link to="/sign-in" className="font-bold text-amber-500">
          sign in
        </Link>
      </p>
    </div>
  );
}
