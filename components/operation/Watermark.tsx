import React from "react";
import Image from "next/image";
export default function Watermark() {
  return (
    <div className="w-[200px] h-[44px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <Image src="/img/watermark.svg" width={200} height={44} alt="" />
    </div>
  );
}
