import { NiceModalHandler } from "@ebay/nice-modal-react";

export const muiDrawerV5 = (
  modal: NiceModalHandler,
): { open: boolean; onClose: () => void; SlideProps: { onExited: () => void } } => {
  return {
    open: modal.visible,
    onClose: () => modal.hide(),
    SlideProps: {
      onExited: () => {
        modal.resolveHide();
        !modal.keepMounted && modal.remove();
      },
    },
  };
};
