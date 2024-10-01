"use client";
import { registerUser } from "@/app/actions/mutation/auth";
import { useToast } from "@/components";
import { AUTH_LOGIN } from "@/components/constants/frontend-routes";
import { zodResolver } from "@hookform/resolvers/zod";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import LoginIcon from "@mui/icons-material/Login";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FilledInput from "@mui/material/FilledInput";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { AuthFormWrapper } from "./AuthFormWrapper";

import { useEffect, useState } from "react";
import { commonPasswords } from "./commonPasswords";

const registerResponse = z.object({
  status: z.enum(["success", "error"]),
  message: z.string(),
});
type TRegisterResponse = z.infer<typeof registerResponse>;

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterFormSchema),
  });
  const toaster = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [registerFormResponse, setRegisterFormResponse] =
    useState<TRegisterResponse>();

  const [submitCredentialsButtonLoading, setSubmitCredentialsButtonLoading] =
    useState(false);

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitCredentialsButtonLoading(true);
    const response = await registerUser({
      ...data,
      provider: "credentials",
      type: "email",
    });
    setRegisterFormResponse(response);
    setSubmitCredentialsButtonLoading(false);
  };

  useEffect(() => {
    if (registerFormResponse) {
      console.log("Register form response:", registerFormResponse);
      toaster.showToast(
        registerFormResponse.message,
        null,
        registerFormResponse.status
      );
    }
  }, [registerFormResponse]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <toaster.ToastComponent />
      <AuthFormWrapper
        headerLabel="Register yourself"
        backButtomLabel="Already have an account?"
        backButtonLink={AUTH_LOGIN}
        showSocial
      >
        {registerFormResponse && (
          <Alert
            icon={<CheckIcon fontSize="inherit" />}
            severity={registerFormResponse.status}
            sx={{ width: "100%", textAlign: "left" }}
          >
            {registerFormResponse.message}
          </Alert>
        )}

        {errors.root && (
          <Alert icon={<CloseIcon fontSize="inherit" />} severity="error">
            {errors.root.message}
          </Alert>
        )}

        <Box width={"100%"}>
          <TextField
            type="text"
            variant="filled"
            fullWidth
            required
            size="small"
            placeholder="Full Name"
            label="Full Name"
            {...register("fullName", { valueAsNumber: false, required: true })}
          />
          {errors.fullName && (
            <Alert icon={<CloseIcon fontSize="inherit" />} severity="error">
              {errors.fullName.message}
            </Alert>
          )}
        </Box>
        <Box width={"100%"}>
          <TextField
            type="email"
            variant="filled"
            fullWidth
            size="small"
            required
            placeholder="Email"
            label="Email"
            {...register("email", { valueAsNumber: false, required: true })}
          />
          {errors.email && (
            <Alert icon={<CloseIcon fontSize="inherit" />} severity="error">
              {errors.email.message}
            </Alert>
          )}
        </Box>

        <Box width={"100%"}>
          <FormControl sx={{ width: "100%" }} required variant="filled">
            <InputLabel htmlFor="filled-adornment-password">
              Password
            </InputLabel>
            <FilledInput
              id="filled-adornment-password"
              type={showPassword ? "text" : "password"}
              fullWidth
              size="small"
              placeholder="Password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              }
              {...register("password", {
                valueAsNumber: false,
                required: true,
              })}
            />
          </FormControl>
          {errors.password && (
            <Alert icon={<CloseIcon fontSize="inherit" />} severity="error">
              {errors.password.message}
            </Alert>
          )}
        </Box>
        <Box width={"100%"}>
          <TextField
            type="password"
            variant="filled"
            fullWidth
            size="small"
            required
            placeholder="Confirm Password"
            label="Confirm Password"
            {...register("confirmPassword", {
              valueAsNumber: false,
              required: true,
            })}
          />
          {errors.confirmPassword && (
            <Alert icon={<CloseIcon fontSize="inherit" />} severity="error">
              {errors.confirmPassword.message}
            </Alert>
          )}
        </Box>
        <Button
          disabled={submitCredentialsButtonLoading}
          startIcon={
            submitCredentialsButtonLoading ? (
              <CircularProgress size={16} />
            ) : (
              <LoginIcon />
            )
          }
          size="large"
          type="submit"
          fullWidth
          variant="contained"
        >
          Submit
        </Button>
      </AuthFormWrapper>
    </form>
  );
}

export const RegisterFormSchema = z
  .object({
    fullName: z.string().min(1, {
      message: "full name is required",
    }),
    email: z.string().email(),
    password: z
      .string()
      .min(1, {
        message: "password is required",
      })
      .max(14, {
        message: "password too long",
      })
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/\d/, { message: "Password must contain at least one digit" })
      .regex(/[@$!%*?&]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      // Add an error to the confirmPassword field
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }

    if (commonPasswords.includes(data.password)) {
      // Add another error to the password field if it contains "123"
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password should not contain common phrases",
      });
    }
  });

type RegisterFormData = z.infer<typeof RegisterFormSchema>;

export type ValidFieldNames =
  | "email"
  | "password"
  | "fullName"
  | "confirmPassword";
