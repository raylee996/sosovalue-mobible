import { Button, IconButton } from "@mui/material";
import Image from "next/image";
import { useDrop } from "ahooks";
import { ChangeEvent, useRef, useState } from "react";
import { uploadFile } from "helper/request";
import { error } from "helper/alert";

const Upload = () => {
  const dropRef = useRef(null);
  const [imageUrl, setImageUrl] = useState("");
  useDrop(dropRef, {
    async onFiles(files) {
      upload(files[0]);
    },
  });
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      upload(files[0]);
    }
  };
  const upload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await uploadFile(formData);
    if (res.data.code === 0) {
      setImageUrl(res.data.data.url);
    } else {
      error(res.data.msg);
    }
  };
  return (
    <div className="w-full h-60 rounded-xl overflow-hidden">
      {imageUrl ? (
        <div className="w-full h-full relative">
          <Image
            src={imageUrl}
            className="w-full h-auto  object-cover"
            fill
            alt=""
          />
          <IconButton
            onClick={() => setImageUrl("")}
            className="absolute top-5 right-5 h-10 w-10 bg-white"
          >
            <Image src="/img/svg/edit.svg" width={16} height={16} alt="" />
          </IconButton>
        </div>
      ) : (
        <Button
          ref={dropRef}
          component="label"
          className="h-full flex-col normal-case border-dashed border-[#E5E5E5]"
          fullWidth
          role={undefined}
          variant="outlined"
          tabIndex={-1}
        >
          <Image src="/img/upload.png" width={72} height={72} alt="" />
          <span className="text-sm font-semibold text-[#0A0A0A] font-lato mt-2 mb-1">
            Drag and Drop cover, or{" "}
            <span className="text-[#FF4F20]">Browse</span>
          </span>
          <span className="text-xs text-[#525252] font-lato">
            Recommended size: 1920 x 1080. Max 10MB.
          </span>
          <input
            type="file"
            onChange={onFileChange}
            style={{
              clip: "rect(0 0 0 0)",
              clipPath: "inset(50%)",
              height: 1,
              overflow: "hidden",
              position: "absolute",
              bottom: 0,
              left: 0,
              whiteSpace: "nowrap",
              width: 1,
            }}
          />
        </Button>
      )}
    </div>
  );
};

export default Upload;
