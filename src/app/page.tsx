"use client";
import { CreateUserForm } from "@/components";
import { IUser } from "@/server/model/users";
import { Box, Typography } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { postPing } from "./actions/mutation/_ping";
import { getPing } from "./actions/query/_ping";

export default function Home() {
  const { data: pingData } = useQuery({
    queryKey: ["get-ping"],
    queryFn: async (): Promise<IUser | undefined> => getPing(),
    refetchOnMount: false,
  });

  const {
    data: pingPostData,
    isPending: pingPostIsPending,
    isSuccess: pingPostIsSuccess,
  } = useMutation({
    mutationKey: ["post-ping"],
    mutationFn: postPing,
  });

  return (
    <main>
      <Box>
        <Typography variant="h5">
          GET <code>/api/ping</code>
        </Typography>
        <Typography variant="body1">{JSON.stringify(pingData)}</Typography>
      </Box>
      <br />
      <Box>
        <Typography variant="h5">
          POST <code>/api/ping</code>
        </Typography>
        <CreateUserForm />
        <Typography variant="body1">{JSON.stringify(pingPostData)}</Typography>
      </Box>
    </main>
  );
}
