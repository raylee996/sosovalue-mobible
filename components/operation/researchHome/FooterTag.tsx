import { ListItemButton } from "@mui/material";
import Guidelines from "components/icons/researcher/Principles.svg"
// import Guidance from "components/icons/researcher/Guidance.svg"
// import Timeline from "components/icons/researcher/Timeline.svg"
import FAQ from "components/icons/researcher/FAQ.svg"
import IframeModal from "./Iframe-Modal";
import { useState } from "react";

const list = [{
    id: 1,
    title: "Guidelines",
    icon: FAQ
}, {
    //     id: 2,
    //     title: "Writing Guidance",
    //     icon: Guidance
    // }, {
    //     id: 3,
    //     title: "Contest Timeline",
    //     icon: Timeline
    // }, {
    id: 4,
    title: "FAQ",
    icon: Guidelines
}]

const FooterTag = () => {
    const [url, setUrl] = useState("");
    const [open, setOpen] = useState(false);
    const handleClickOpen = (idx: number) => {
        setOpen(true);
        const pathname = process.env.NEXT_PUBLIC_ENV === "production" ? "https://alpha.sosovalue.com/brain-battle" : "https://best-champagne-350425.framer.app/brain-battle"
        setUrl(`${pathname}/#${idx}`)
    };

    const handleClose = () => {
        setOpen(false);
    };
    return <>
        <div className="flex gap-4 mb-[60px]">
            {list.map((i, idx) =>
                <ListItemButton
                    onClick={() => handleClickOpen(idx + 7)}
                    className="p-4 flex-1 bg-white rounded-2xl flex flex-col gap-4 items-center justify-center"
                    key={i.title + idx}>
                    <div className="w-8 h-8 flex items-center"><i.icon className="w-full h-full" /></div>
                    <div className="text-[#525252] text-base text-center flex items-center">{i.title}</div>
                </ListItemButton>)}
        </div>
        <IframeModal
            open={open}
            onClose={handleClose}
            url={url}
        />
    </>
}
export default FooterTag;