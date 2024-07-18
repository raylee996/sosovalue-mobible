import React from "react";
import Grow from "@mui/material/Grow";
import LoadingButton from "@mui/lab/LoadingButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";

const noop = () => {};

type Context = {
  setOpen: Function;
  show: Function;
};

const DialogContext = React.createContext<Context>({
  setOpen: noop,
  show: noop,
});

type Props = React.PropsWithChildren<{}>;
type Options = {
  title?: string;
  content: string | React.ReactNode;
  onOk?: () => Promise<any> | void;
};

export const DialogProvider = ({ children }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState<Options>({
    title: "",
    content: "",
  });
  const { title, content, onOk } = options;
  const close = () => {
    setOpen(false);
  };

  const confirm = async () => {
    setLoading(true);
    if (onOk) {
      const promise = onOk();
      if (promise) {
        try {
          await promise;
        } catch (error) {
          console.error(error);
        }
      }
    }
    setLoading(false);
    close();
  };
  const show = (options: Options) => {
    setOpen(true);
    setOptions(options);
  };
  const value = {
    setOpen,
    show,
  };
  return (
    <DialogContext.Provider value={value}>
      {children}
      <Dialog
        TransitionComponent={Grow}
        open={open}
        onClose={close}
        //aria-labelledby="alert-dialog-title"
        //aria-describedby="alert-dialog-description"
        classes={{
          paper:
            "bg-dropdown-White-800 flex-1 shadow-[0_0_8px_0_rgba(0,0,0,0.36)] rounded-lg",
        }}
      >
        {" "}
        {title && (
          <DialogTitle className="flex items-center bg-dropdown-White-800 text-primary-900-White justify-center text-base font-medium py-4">
            {/* <ErrorRoundedIcon className='text-[#FF7D00] mr-2' /> */}
            {title}
          </DialogTitle>
        )}
        <DialogContent className="bg-dropdown-White-800">
          <DialogContentText className="text-sm text-primary-900-White">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="flex justify-center flex-col bg-dropdown-White-800 items-center px-6 gap-4 mb-6">
          <LoadingButton
            size="small"
            loading={loading}
            onClick={confirm}
            className="w-full h-10 leading-6 white normal-case bg-brand-accent-600-600 font-medium rounded-lg m-0 text-sm"
            variant="contained"
          >
            Delete
          </LoadingButton>
          <LoadingButton
            size="small"
            loading={loading}
            onClick={close}
            className="w-full m-0 h-10 leading-6 rounded-lg text-sm bg-dropdown-White-800 text-primary-900-White border border-solid border-primary-100-700 font-medium normal-case"
            color="inherit"
            variant="contained"
          >
            Cancel
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const { show } = React.useContext(DialogContext);
  const confirm = (options: Options) => {
    show(options);
  };

  return {
    confirm,
  };
};
