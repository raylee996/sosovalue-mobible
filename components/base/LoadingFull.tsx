import NiceModal, { useModal, muiDialogV5 } from "@ebay/nice-modal-react";
import Dialog from "@mui/material/Dialog";
import ScaleLoader from "./ScaleLoader";

type Props = {
  show?: boolean;
};

const LoadingFull = NiceModal.create(({ show }: Props) => {
  const modal = useModal();

  return (
    <Dialog
      open={show || modal.visible}
      fullScreen
      className="z-[9999]"
      sx={{
        ".MuiBackdrop-root": {
          backdropFilter: "blur(2px)",
        },
        ".MuiPaper-root": {
          backgroundImage: "none",
          backgroundColor: "transparent",
        },
      }}
    >
      <div className="w-full h-full text-primary-900-White flex items-center justify-center">
        <ScaleLoader />
      </div>
    </Dialog>
  );
});

export default LoadingFull;
