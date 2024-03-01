"use client";
import { Button, FormControl, TextField } from "@mui/material";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { APP } from "../firebase";
import { AuthContext } from "@/contexts/SessionProvider/AuthContext";

interface FormValues {
  email: string;
  confirmPassword: string;
  password: string;
}

export default function SignUpForm() {
  const auth = getAuth(APP);
  const { createAccount }: AuthContextProps = useContext(AuthContext)!;
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async () => {
    createAccount(getValues("email"), getValues("password"));
  };

  return (
    <form
      className="border py-6 px-4 border-white border-solid bg-white max-w-[500px] w-[90vw] grid gap-4 
      left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormControl>
        <TextField
          inputProps={{
            ...register("email", {
              required: { value: true, message: "Field required" },
            }),
          }}
          sx={{ bgcolor: "white" }}
          variant="outlined"
          label="Email"
        />
        {errors.email && (
          <span className="text-red-700">{errors.email.message}</span>
        )}
      </FormControl>
      <FormControl>
        <TextField
          inputProps={{
            ...register("confirmPassword", {
              required: { value: true, message: "Field required" },
            }),
          }}
          sx={{ bgcolor: "white" }}
          type="password"
          variant="outlined"
          label="Password"
        />
        {errors.confirmPassword && (
          <span className="text-red-700">{errors.confirmPassword.message}</span>
        )}
      </FormControl>
      <FormControl>
        <TextField
          inputProps={{
            ...register("password", {
              required: { value: true, message: "Field required" },
            }),
          }}
          sx={{ bgcolor: "white" }}
          type="password"
          variant="outlined"
          label="Confirm Password"
        />
        {errors.password && (
          <span className="text-red-700">{errors.password.message}</span>
        )}
      </FormControl>
      <div className="grid grid-flow-col gap-4">
        <Button type="submit" variant="contained">
          SIGN UP
        </Button>
      </div>
    </form>
  );
}
