import {
  Alert,
  alpha,
  Box,
  Slide,
  SlideProps,
  Snackbar,
  Typography,
  useTheme,
} from "@mui/material";
import { SetStateAction } from "react";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

export interface IToastMessage {
  messageTitle: string;
  messageSubtitle?: string | null;
}

export type IToastServity = "error" | "info" | "warning" | "success";

interface IToast {
  type: IToastServity;
  message: IToastMessage;
  setMessage: React.Dispatch<SetStateAction<IToastMessage>>;
}

export function Toast({ type = "info", message, setMessage }: IToast) {
  const theme = useTheme();

  const getSubtitleColor = () => {
    switch (type) {
      case "error":
        return alpha(theme.palette.error.contrastText, 0.7);
      case "warning":
        return alpha(theme.palette.warning.contrastText, 0.7);
      case "success":
        return alpha(theme.palette.success.contrastText, 0.7);
      case "info":
        return alpha(theme.palette.info.contrastText, 0.7);
      default:
        return alpha(theme.palette.info.contrastText, 0.7);
    }
  };
  return (
    <Snackbar
      open={message.messageTitle.length > 0}
      TransitionComponent={SlideTransition}
      key={SlideTransition.name}
      autoHideDuration={1200}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={() =>
          setMessage({
            messageTitle: "",
            messageSubtitle: "",
          })
        }
        severity={type}
        variant="filled"
        sx={{ width: "100%" }}
      >
        <Box display="flex" flexDirection="column">
          <Typography variant="body1">{message.messageTitle}</Typography>
          <Typography variant="body2" color={getSubtitleColor()}>
            {message.messageSubtitle}
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
}
