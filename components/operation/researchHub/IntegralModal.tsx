import Image from "next/image";
import NiceModal, { muiDialogV5, useModal } from "@ebay/nice-modal-react";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import ButtonBase from "@mui/material/ButtonBase";
import { Lato } from "next/font/google";
import CloseSvg from "components/icons/close.svg";
import { getUserExp, getExpList } from "http/activity";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { ScaleLoader } from "react-spinners";
import { formatDate } from "helper/tools";
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
  const [exp, setExp] = useState<number | string>("🧠");
  const [expList, setExpList] = useState<any[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const handleClose = () => {
    modal.hide();
  };
  const getExp = async () => {
    const res = await getUserExp();
    setExp(res.data.experienceVal);
  };
  const getList = async () => {
    const res = await getExpList({
      pageNum: 1,
      pageSize: 100,
      orderItems: [{ column: "create_time", desc: true }],
    });
    setLoading(false);
    setExpList(res.data.list);
  };
  useEffect(() => {
    getExp();
    getList();
  }, []);
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
        onClick={handleClose}
        className="absolute z-10 -right-3 -top-3 w-10 h-10 flex justify-center items-center bg-white text-[#171717] text-xs rounded-full shadow border border-solid border-neutral-200"
      >
        <CloseSvg />
      </ButtonBase>
      <div className="w-full h-[100px] relative overflow-hidden">
        <Image
          width={381}
          height={202}
          className="rounded-md border border-solid w-full h-auto border-neutral-100"
          src="/img/researcherHub/brainbattle-banner.png"
          alt=""
        />
      </div>
      <div className={`p-6 ${lato.variable}`}>
        <div className="text-center text-[#141414] text-[32px] font-bold leading-[38px] !font-lato">
          Your Brain EXP
        </div>
        <div className="text-center text-[#FF4F20] text-[40px] font-bold leading-[29px] !font-lato my-6">
          {exp}
        </div>
        <div className="text-center text-[#333] text-base leading-[22px] !font-lato line-clamp-3">
          Brain EXPs are highly esteemed experience points awarded for
          consistently delivering high-quality contributions.
        </div>
        <div className="h-[1px] bg-[#E5E5E5] my-6"></div>
        <div className="overflow-y-auto h-[150px] relative">
          {loading && (
            <ScaleLoader
              color="#FF4F20"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
          )}
          {!loading &&
            expList &&
            expList?.length > 0 &&
            expList?.map((item, index) => (
              <div
                key={index}
                className="border-0 border-b border-solid border-[#E5E5E5] py-3 relative pr-[106px]"
              >
                <div className="text-base text-[#333] leading-[22px] mb-1 truncate">
                  {item.remark}
                </div>
                <div className="text-base text-[#333] leading-[22px]">
                  <span className="text-[#FF4F20] mr-1">
                    {item.category == 1 ? "+" : "-"}
                    {item.experienceVal}
                  </span>
                  Brain EXP
                </div>
                <div className="absolute right-0 top-0 h-[74px] leading-[74px] text-base text-[#333] opacity-30">
                  {formatDate(item?.createTime)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </Dialog>
  );
});

export default ImportModal;
