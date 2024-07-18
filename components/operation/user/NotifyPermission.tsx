import { Button, Drawer } from "@mui/material";
import Image from "next/image";
import { useContext } from "react";
import { UserContext } from "store/UserStore";
import useOneSignalStore from "store/useOneSignalStore";
import { useShallow } from "zustand/react/shallow";

const NotifyPermission = () => {
  const { openOrCloseSubscription } = useOneSignalStore(
    useShallow((state) => ({
      openOrCloseSubscription: state.openOrCloseSubscription,
    }))
  );
  const { userModal } = useContext(UserContext);
  const allowNotify = (isAllow: boolean) => {
    openOrCloseSubscription(isAllow);
    userModal?.notifyPermission.close();
  };
  return (
    <Drawer
      anchor="bottom"
      open={userModal?.notifyPermission.show}
      classes={{ paper: "bg-[#1F1F1F] rounded-t-xl" }}
    >
      <div className="flex flex-col items-center py-9 px-8">
        <Image src="/img/svg/BellRinging.svg" width={72} height={72} alt="" />
        <div className="my-4 text-xl font-semibold text-white">
          Enable notifications
        </div>
        <div className="text-sm text-sub-title mb-12 text-center">
          Never miss out any news if SoSoValue is offline.
        </div>
        <Button
          className="normal-case h-12 rounded-xl mb-3 text-title"
          fullWidth
          variant="contained"
          onClick={() => allowNotify(true)}
        >
          Allow notifications
        </Button>
        <Button
          className="normal-case h-12 rounded-xl text-content"
          fullWidth
          onClick={() => allowNotify(false)}
        >
          Deny
        </Button>
      </div>
    </Drawer>
  );
};

export default NotifyPermission;
