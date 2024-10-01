import { startLogout } from "@/app/actions/query/auth";
import { Button } from "@mui/material";

interface SignOutButtonProps {
  fullWidth?: boolean;
  variant: "text" | "outlined" | "contained";
}
export function SignOutButton({
  fullWidth = false,
  variant,
}: SignOutButtonProps) {
  return (
    <form action={startLogout}>
      <Button
        fullWidth={fullWidth}
        variant={variant}
        color="error"
        type="submit"
      >
        SIGN OUT
      </Button>
    </form>
  );
}
