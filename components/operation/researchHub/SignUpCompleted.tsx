import React, { useContext } from "react";
import { Envelope, ShareFat, House } from "@phosphor-icons/react";
import { Button, TextField } from "@mui/material";
import Image from "next/image";
import { UserContext } from "store/UserStore";
import useNotistack from "hooks/useNotistack";
type Props = {
  changeStatus: (status: number) => void;
};
const Contribute = ({ changeStatus }: Props) => {
  const { user } = useContext(UserContext);
  const { success } = useNotistack();
  const toastTip = () => {
    success("Research Submittion will be available on 18th Jun.");
  };
  return (
    <div className="p-5">
      <div className="w-full flex items-center justify-between h-[64px]">
        <div className="flex items-center">
          <Image
            src={user?.photo || "/img/researcherHub/Avatar.png"}
            width={64}
            height={64}
            alt=""
            className="mr-6"
          />
          <div>
            <div className="text-[18px] font-bold text-[#0A0A0A] leading-7 mb-2">
              {user?.username}
            </div>
            <div className="text-[12px] font-bold h-[20px] leading-4 text-center text-[#FF4F20] rounded-lg border border-solid border-[#FFEDE9] bg-[#FFF7F5]">
              S2 Participant
            </div>
          </div>
        </div>
        
      </div>
      <div className="flex items-center justify-between mt-6">
      <div
        onClick={() => changeStatus(0)}
        className="border border-solid cursor-pointer border-[#E5E5E5] flex items-center text-base text-[#0A0A0A] rounded-lg px-5 py-2 shadow-[0_1px_2px_0_0_rgba(10,10,10,0.06)]"
      >
        <Image
          src="/img/researcherHub/Group.svg"
          width={16}
          height={16}
          className="mr-2"
          alt=""
        />
        Edit
      </div>
      <Button
        onClick={toastTip}
        className="h-[44px] cursor-not-allowed text-[#FFF] normal-case text-base rounded-lg font-medium  bg-[#FFB39F] px-6"
      >
        Submit Research
      </Button>
      </div>
    </div>
  );
};

export default Contribute;
