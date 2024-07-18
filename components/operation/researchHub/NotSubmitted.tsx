import React, { useContext } from "react";
import { Button, TextField } from "@mui/material";
const NotSubmitted = () => {
  return (
    <>
      <div className="text-[24px] text-[#0A0A0A] font-bold !font-lato absolute left-4 top-4">
        Researcher Hub
      </div>
      <div className="flex flex-col items-center justify-center h-[400px]">
        <div className="text-[20px] text-[#0A0A0A] leading-8 !font-lato mb-[7px]">
          No submitted research
        </div>
        <div className="text-xs text-[#525252] leading-[14px] !font-lato">
          Click here to create your master piece!
        </div>
      </div>
      <div className="text-[#737373] text-xs leading-[1.4] !font-lato absolute bottom-4 left-4 right-4">
        We accept submissions in all languages. Your research will be translated
        into English correctly at the end of the submission period since the
        judges are reading in English.
      </div>
    </>
  );
};

export default NotSubmitted;
