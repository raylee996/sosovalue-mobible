import React from "react";
import ScaleLoader from "components/base/ScaleLoader";
const Empty = () => {
  const loadingWrap = React.useRef<HTMLDivElement>(null);
  return (
    <div
      className="flex justify-center items-center text-primary h-full"
      ref={loadingWrap}
    >
      <ScaleLoader />
    </div>
  );
};

export default Empty;
