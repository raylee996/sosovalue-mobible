import { Button } from "@mui/material";
import { PlusCircle } from "@phosphor-icons/react";
import Count from "./Count";
import { useState } from "react";
import IframeModal from "./Iframe-Modal";

const list = [{
  title: "💰 Total Prize Pool",
  amount: 50,
  unit: "$",
  rate: 1000
}, {
  title: "🧠 Brain EXP Pool",
  amount: 50,
  unit: "",
  rate: 10000000
}]

const HeaderTag = () => {
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);
  const handleClickOpen = (idx: number) => {
    const pathname = process.env.NEXT_PUBLIC_ENV === "production" ? "https://alpha.sosovalue.com/brain-battle" : "https://best-champagne-350425.framer.app/brain-battle"
    setUrl(`${pathname}/#${idx}`)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return <div className="flex items-center gap-4 w-full !overflow-x-auto hide-scrollbar">
    {list.map((i, idx) => {
      return (
        <div className="w-[240px] h-[150px] shrink-0 flex flex-col p-4 justify-center gap-4 bg-[linear-gradient(204deg,#FF4F20_12.32%,#FF8438_87.68%)] rounded-2xl text-[#fff] relative" key={i.title}>
          <div className="font-bold text-center text-base">{i.title}</div>
          <Count className="font-bold text-center text-[32px] !font-fjalla leading-[140%]" rate={i.rate} total={i.amount} unit={i.unit} />
          <Button className="m-auto py-0.5 border-none px-2 text-[#0a0a0a] h-4 normal-case bg-white font-medium rounded-full text-[10px]"
            variant="outlined"
            onClick={() => handleClickOpen(idx + 1)}
            endIcon={<PlusCircle size={12} />}
          >
            Learn More
          </Button>
        </div>
      )
    })}
    <div className="bg-[#fefefe] rounded-2xl w-[240px] h-[150px] shrink-0 relative p-4">
      <div className="text-[#0a0a0a] font-bold text-base ">Badge Rewards</div>
      <Button className="mt-9 py-0.5 px-2 text-[#0a0a0a] border border-solid border-[#e5e5e5] h-4 normal-case bg-white font-medium rounded-full text-[10px] absolute bottom-4 left-4"
        variant="outlined"
        onClick={() => handleClickOpen(3)}
        endIcon={<PlusCircle size={12} />}
      >
        Learn More
      </Button>

      <div className="absolute bottom-0 right-0 w-[125px] h-[125px] bg-[url('/img/activity/badge.png')] bg-contain bg-no-repeat rounded-ee-2xl">
        {/* <Image alt="" src="/img/activity/s2/badge.png" width={207} height={207} layout="responsive" className="w-full h-full object-cover" /> */}
      </div>
    </div>
    <IframeModal
      open={open}
      onClose={handleClose}
      url={url}
    />
  </div>
}

export default HeaderTag;