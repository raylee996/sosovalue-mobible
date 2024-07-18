import React, { useEffect, useState } from "react";
import { CaretDown, CaretUp, ShareFat, House } from "@phosphor-icons/react";
import { Button } from "@mui/material";
import Image from "next/image";
import SignUpForm from "./SignUpForm";
import SignupComponent from "../login/SignupComponent";
import SignUpCompleted from "./SignUpCompleted";
import SignUpSent from "./SignUpSent";
import Link from "next/link";
import { getSignResult } from "http/activity";
import useNotistack from "hooks/useNotistack";
import { copyText } from "helper/tools";
import { getLink } from "helper/config";
const Contribute = () => {
  const [status, setStatus] = useState<number>(0);
  const { success } = useNotistack();
  const [data, setData] = useState<any>();
  const changeStatus = (status: number) => {
    setStatus(status);
  };

  const getSignUp = async () => {
    const res = await getSignResult();

    setData(res.data);
    if (res.data) {
      setStatus(1);
    } else {
      setStatus(0);
    }
  };
  useEffect(() => {
    getSignUp();
  }, []);
  return (
    <div className="h-full bg-white">
      <div className="w-full h-full overflow-y-auto pb-[48px] pt-[130px] bg-[url('/img/researcherHub/GenGroup.png')] bg-cover bg-no-repeat bg-white">

        <div className="px-[32px] flex items-center justify-between">
          <Image
            src="/img/researcherHub/Frame.png"
            width={184}
            height={40}
            alt=""
          />
        </div>
        <div className="flex items-center justify-between px-[32px] mt-[48px]">
          <div>
            <div className="h-[122px] text-[48px] font-bold text-[#0A0A0A]">
              Researcher Hub
            </div>
            {status === 0 &&
            <div className="text-[18px] text-[#0A0A0A] leading-7 !font-lato my-[48px]">
              <p className="m-0">Hi Rakshamann,</p>
              <p className="m-0">
              how do we reach you out when it's time to send the prize?
              </p>
            </div>
            }
            {status === 1 &&
            <div className="text-[18px] text-[#0A0A0A] leading-7 !font-lato my-[48px]">
              <p className="m-0">
              Research submission will be available on Jun 18th.
              </p>
            </div>
            }
          </div>
        </div>
        <div className="border-2 border-solid border-[#FF4F20] bg-[#fff] mx-[32px] rounded-2xl !font-lato">
          {status === 0 && <SignUpForm changeStatus={changeStatus} />}
          {/* {status === 1 && <SignUpCompleted changeStatus={changeStatus} />} */}
          {status === 1 && <SignUpSent changeStatus={changeStatus} />}
          {/* <SignUpCompleted /> */}
          {/* <SignUpSent /> */}
        </div>
      </div>
    </div>
  );
};

export default Contribute;
