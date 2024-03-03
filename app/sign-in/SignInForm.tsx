"use client";
import { AuthContext } from "@/contexts/SessionProvider/AuthContext";
import { Alert, Button, FormControl, Grow, TextField } from "@mui/material";
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
    setError,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async () => {
    login(getValues("email"), getValues("password")).catch((error) => {
      const errorCode = error.code;

      switch (errorCode) {
        case "auth/invalid-email": {
          setError("email", { message: "Invalid email format." });
          break;
        }
        case "auth/invalid-credential": {
          setError("email", { message: "Invalid email or password." });
          setError("password", { message: "Invalid email or password." });
          break;
        }
        case "auth/too-many-requests": {
          setError("email", {
            message:
              "Access to this account has been temporarily disabled due to many failed login attempts.",
          });
          setError("password", {
            message:
              "Access to this account has been temporarily disabled due to many failed login attempts.",
          });
          break;
        }
        default: {
          setError("email", {
            message: "Unknown erroro, please try contacting admin.",
          });
          setError("password", {
            message: "Unknown erroro, please try contacting admin.",
          });
          break;
        }
      }
    });
  };

  return (
    <form
      className="absolute border py-6 px-4 border-white border-solid bg-white
      top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 max-w-[500px] w-[90vw] grid gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {!!errors.email?.message && (
        <Grow in={!!errors}>
          <Alert
            variant="standard"
            color="error"
            sx={{ py: 0 }}
            severity="error"
          >
            {errors.email?.message}
          </Alert>
        </Grow>
      )}
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
      </FormControl>
      <div className="grid grid-flow-col gap-4">
        <Button
          type="submit"
          variant="contained"
          style={{ background: "#092a50" }}
        >
          SIGN IN
        </Button>
        <Button variant="outlined" onClick={() => router.replace("/sign-up")}>
          SIGN UP
        </Button>
      </div>
    </form>
  );
}
