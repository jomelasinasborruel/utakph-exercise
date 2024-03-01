"use client";
import { AuthContext } from "@/contexts/SessionProvider/AuthContext";
import { Button, FormControl, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useForm } from "react-hook-form";

interface FormValues {
  email: string;
  password: string;
}

export default function SignInForm() {
  const router = useRouter();
  const { login }: AuthContextProps = useContext(AuthContext)!;
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async () => {
    login(getValues("email"), getValues("password"));
  };

  return (
    <form
      className="absolute border py-6 px-4 border-white border-solid bg-white
      top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 max-w-[500px] w-[90vw] grid gap-4"
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
            ...register("password", {
              required: { value: true, message: "Field required" },
            }),
          }}
          sx={{ bgcolor: "white" }}
          type="password"
          variant="outlined"
          label="Password"
        />
        {errors.password && (
          <span className="text-red-700">{errors.password.message}</span>
        )}
      </FormControl>
      <div className="grid grid-flow-col gap-4">
        <Button type="submit" variant="contained">
          SUBMIT
        </Button>
        <Button variant="outlined" onClick={() => router.push("/sign-up")}>
          SIGN UP
        </Button>
      </div>
    </form>
  );
}
