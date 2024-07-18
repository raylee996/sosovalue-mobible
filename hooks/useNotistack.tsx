import { useSnackbar, OptionsObject } from "notistack";
import Alert, { AlertProps } from "@mui/material/Alert";

const useNotistack = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const show = (msg: string, options?: OptionsObject) => {
    enqueueSnackbar(msg, {
      anchorOrigin: { horizontal: "center", vertical: "top" },
      autoHideDuration: 1500, // 默认1.5秒后自动关闭
      ...options,
    });
  };
  const success = (msg: string, options?: OptionsObject) => {
    show(msg, {
      content: (key, message) => (
        <div id={String(key)}>
          <Alert severity="success">{message}</Alert>
        </div>
      ),
      ...options,
    });
  };
  const error = (msg: string, options?: OptionsObject) => {
    show(msg, {
      content: (key, message) => (
        <div id={String(key)}>
          <Alert severity="error">{message}</Alert>
        </div>
      ),
      ...options,
    });
  };
  const warning = (msg: string, options?: OptionsObject) => {
    show(msg, {
      content: (key, message) => (
        <div id={String(key)}>
          <Alert severity="warning">{message}</Alert>
        </div>
      ),
      ...options,
    });
  };
  const info = (msg: string, options?: OptionsObject) => {
    show(msg, {
      content: (key, message) => (
        <div id={String(key)}>
          <Alert severity="info">{message}</Alert>
        </div>
      ),
      ...options,
    });
  };
  return {
    success,
    warning,
    info,
    error,
    enqueueSnackbar,
    closeSnackbar,
  };
};

export default useNotistack;
