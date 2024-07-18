import { ListItemButton } from "@mui/material";
import { ArrowUpRight } from "@phosphor-icons/react";
import { splitNum } from "helper/tools";
import IframeModal from "./Iframe-Modal";
import { useState } from "react";

const sectors = [
  {
    id: 1,
    title: "BTC Analysis",
    num: 20000,
  },
  {
    id: 2,
    title: "Sector Analysis",
    num: 15000,
  },
  {
    id: 3,
    title: "Other Topics",
    num: 11000,
  },
];

const ResearchTheme = () => {
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);
  const handleClickOpen = (idx: number) => {
    setOpen(true);
    const pathname =
      process.env.NEXT_PUBLIC_ENV === "production"
        ? "https://alpha.sosovalue.com/brain-battle"
        : "https://best-champagne-350425.framer.app/brain-battle";
    setUrl(`${pathname}/#${idx}`);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="p-4 rounded-2xl bg-[#FEFEFE]">
      {/* <div className="mb-8 text-[32px] font-bold text-[#0A0A0A]">Research Theme</div> */}
      <div className="flex gap-4 flex-col">
        <div className="flex-1 flex items-start justify-center gap-3 flex-col">
          <div className="text-[#0A0A0A] text-xl font-bold">
            Pick Your Battles
          </div>
          <div className="text-[#0A0A0A] text-base">
            Submit your thesis for one or multiple tracks
          </div>
        </div>
        {sectors.map((sec, idx) => {
          return (
            <ListItemButton
              onClick={() => handleClickOpen(idx + 4)}
              key={sec.id + idx}
              className="flex-1 p-6 normal-case bg-[linear-gradient(180deg,#FFF_0%,#F4F4F5_100%)] rounded-lg border border-solid border-[#E4E4E7] flex flex-col items-start justify-between gap-3"
            >
              {/* {sec.title}<Plus size={32} color="#1f1f1f" /> */}
              <div className="flex items-center gap-3 justify-between w-full">
                <div className=" text-[#0A0A0A] text-xl font-medium whitespace-nowrap">
                  {sec.title}
                </div>
                <ArrowUpRight size={16} color="#0A0A0A" className=" shrink-0" />
              </div>
              <div className="text-[#FF4F20] !font-ddin text-[40px] font-bold leading-[140%]">
                ${splitNum(sec.num)}+
              </div>
            </ListItemButton>
          );
        })}
      </div>
      <IframeModal open={open} onClose={handleClose} url={url} />
    </div>
  );
};

export default ResearchTheme;
