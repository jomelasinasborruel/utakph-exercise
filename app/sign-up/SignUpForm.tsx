"use client";
import { AuthContext } from "@/contexts/SessionProvider/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Fade, FormControl, TextField } from "@mui/material";
import { getAuth } from "firebase/auth";
import { useContext } from "react";
import { FieldError, FieldErrors, useForm } from "react-hook-form";
import { z } from "zod";
import { APP } from "../firebase";
import Grow from "@mui/material/Grow";
import { useRouter } from "next/navigation";
import { error } from "console";

const validationSchema = z
  .object({
    // name: z.string().min(1, { message: "Must have at least 1 character" }),
    email: z.string().min(1, { message: "Please fill up this field." }).email({
      message: "Must be a valid email.",
    }),
    password: z.string().min(1, { message: "Please fill up this field." }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please fill up this field." }),
  })
  .refine((data) => data.password.length >= 8, {
    message: "Password must be at least 8 characters",
    path: ["password"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

type SchemaProps = z.infer<typeof validationSchema>;

export default function SignUpForm() {
  const { createAccount }: AuthContextProps = useContext(AuthContext)!;
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<SchemaProps>({ resolver: zodResolver(validationSchema) });

  const onSubmit = async () => {
    createAccount(getValues("email"), getValues("password")).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log({ errorCode, errorMessage });

      if (errorCode === "auth/email-already-in-use") {
        console.log("asd");
        setError("email", { message: "This email iis already registered." });
      }
    });
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
            ...register("email"),
          }}
          sx={{ bgcolor: "white" }}
          variant="outlined"
          label="Email"
        />
        {errors.email && (
          <Grow in={!!errors.email}>
            <Alert
              variant="standard"
              color="error"
              sx={{ py: 0 }}
              severity="error"
            >
              {errors.email?.message}{" "}
            </Alert>
          </Grow>
        )}
      </FormControl>

      <FormControl>
        <TextField
          inputProps={{
            ...register("password"),
          }}
          sx={{ bgcolor: "white" }}
          type="password"
          variant="outlined"
          label="Password"
        />
        {errors.password && (
          <Grow in={!!errors.password}>
            <Alert
              variant="standard"
              color="error"
              sx={{ py: 0 }}
              severity="error"
            >
              {errors.password?.message}{" "}
            </Alert>
          </Grow>
        )}
      </FormControl>

      <FormControl>
        <TextField
          inputProps={{
            ...register("confirmPassword"),
          }}
          sx={{ bgcolor: "white" }}
          type="password"
          variant="outlined"
          label="Confirm Password"
        />
        {errors.confirmPassword && (
          <Grow in={!!errors.confirmPassword}>
            <Alert
              variant="standard"
              color="error"
              sx={{ py: 0 }}
              severity="error"
            >
              {errors.confirmPassword?.message}{" "}
            </Alert>
          </Grow>
        )}
      </FormControl>
      <div className="grid grid-flow-row gap-4">
        <Button
          type="submit"
          variant="contained"
          style={{ background: "#092a50" }}
        >
          SIGN UP
        </Button>
        <Button onClick={() => router.replace("/sign-in")} variant="outlined">
          SIGN IN
        </Button>
      </div>
    </form>
  );
}
