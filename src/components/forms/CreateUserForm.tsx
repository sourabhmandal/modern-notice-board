"use client";
import { postPing } from "@/app/actions/mutation/_ping";
import { userRoleEnum } from "@/server/model/users";
import { zodResolver } from "@hookform/resolvers/zod";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

export function CreateUserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
    control,
  } = useForm<UserFormData>({
    resolver: zodResolver(UserFormSchema),
  });

  // log form state changes
  const formDataState = watch();
  useEffect(() => {
    console.debug(formDataState);
  }, [formDataState]);
  // log form state changes

  const {
    data: pingPostData,
    isPending: pingPostIsPending,
    isSuccess: pingPostIsSuccess,
    mutate: pingPostMutate,
  } = useMutation({
    mutationKey: ["post-ping"],
    mutationFn: postPing,
  });

  const onSubmit = async (data: UserFormData) => {
    console.log("SUCCESS", data);
    pingPostMutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack
        display="flex"
        flexDirection="column"
        justifyContent="center"
        gap={2}
        width={500}
      >
        {pingPostData && pingPostIsSuccess && (
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
            Here is a gentle confirmation that your action was successful.
          </Alert>
        )}

        {errors.root && (
          <Alert icon={<CloseIcon fontSize="inherit" />} severity="error">
            {errors.root.message}
          </Alert>
        )}
        <Typography variant="h6" textAlign="center">
          Create User Form
        </Typography>

        <TextField
          type="text"
          variant="filled"
          placeholder="Name"
          {...register("name", { valueAsNumber: false, required: true })}
        />
        {errors.name && (
          <Alert icon={<CloseIcon fontSize="inherit" />} severity="error">
            {errors.name.message}
          </Alert>
        )}

        <FormControl variant="filled">
          <InputLabel id="user-select-filled-label">Role</InputLabel>
          <Controller
            control={control}
            name="role"
            defaultValue={pingPostData?.role}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                labelId="user-select-filled-label"
                id="user-select-filled"
                {...field}
              >
                {userRoleEnum.enumValues
                  .filter((n) => n !== undefined)
                  .map((d: string) => (
                    <MenuItem
                      key={d.toLowerCase().replaceAll(" ", "_")}
                      value={d}
                    >
                      {d}
                    </MenuItem>
                  ))}
              </Select>
            )}
          />
          {errors.role && (
            <Alert icon={<CloseIcon fontSize="inherit" />} severity="error">
              {errors.role.message}
            </Alert>
          )}
        </FormControl>

        <Button type="submit" variant="contained">
          {pingPostIsPending && <CircularProgress size={20} />} Submit
        </Button>
      </Stack>
    </form>
  );
}

export const UserFormSchema = z.object({
  name: z.string().min(5).max(20),
  role: z.enum(userRoleEnum.enumValues),
});

type UserFormData = z.infer<typeof UserFormSchema>;

export type ValidFieldNames = "name" | "role";
