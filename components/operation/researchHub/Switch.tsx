import Image from "next/image";
import NiceModal, { muiDialogV5, useModal } from "@ebay/nice-modal-react";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import ButtonBase from "@mui/material/ButtonBase";
import { Lato } from "next/font/google";
import CloseSvg from "components/icons/close.svg";
import { getUserExp, getExpList } from "http/activity";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { copyText } from "helper/tools";
import useNotistack from "hooks/useNotistack";
import { getOrigin, getPcWebsite } from "helper/config";
const lato = Lato({
  variable: "--font-lato",
  style: "normal",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});
interface Props {}

const ImportModal = NiceModal.create((props: Props) => {
  const modal = useModal();
  const { success } = useNotistack();
  const [exp, setExp] = useState<number>(0);
  const [expList, setExpList] = useState<any[]>();
  const handleClose = () => {
    copyText(`${getPcWebsite()}/brain-battle`);
    success("Link copied, paste to PC to continue");
    modal.hide();
  };

  return (
    <Dialog
      {...muiDialogV5(modal)}
      onClose={() => {}}
      classes={{
        paper:
          "p-1.5 flex justify-start flex-col gap-4 relative overflow-visible max-w-full bg-[#FEFEFE] m-4",
      }}
    >
      <ButtonBase
        onClick={() => modal.hide()}
        className="absolute z-10 -right-3 -top-3 w-10 h-10 flex justify-center items-center bg-white text-[#171717] text-xs rounded-full shadow border border-solid border-neutral-200"
      >
        <CloseSvg />
      </ButtonBase>
      <div className="w-full h-[150px] relative overflow-hidden bg-[url('/img/researcherHub/switch.png')] bg-cover bg-center">
        {/* <Image
          width={381}
          height={202}
          className="rounded-md border border-solid w-full h-auto border-neutral-100"
          src="/img/researcherHub/switch.png"
          alt=""
        /> */}
      </div>
      <div className={`p-6 ${lato.variable} text-center`}>
        <div className="text-center text-[#141414] text-[32px] font-bold leading-[38px] !font-lato">
          Switch to Computer
        </div>

        <div className="text-center text-[#333] mt-6 text-base leading-[22px] !font-lato">
          To ensure the best editing experience, please access our article
          editor from a computer.
        </div>
        <Button
          onClick={handleClose}
          className={`h-[44px] mt-[48px] mx-auto text-[#FFF] normal-case text-[16px] font-medium z-10 rounded-lg !font-lato bg-[#FF4F20] px-6 shadow-[0_1px_2px_0_rgba(10,10,10,0.06)] w-[120px] text-center`}
        >
          Copy link
        </Button>
      </div>
    </Dialog>
  );
});

export default ImportModal;
