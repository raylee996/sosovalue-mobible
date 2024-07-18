import { useEffect, useState } from "react";

type Props = {
  length?: number;
  strokeWidth?: number;
  strokeColor?: string;
};

const CheckAnimate = ({
  length = 40,
  strokeWidth = 2,
  strokeColor = "#FF4F20",
}: Props) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  return (
    <svg width={length} height={length}>
      <circle
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        cx={length / 2}
        cy={length / 2}
        r={(length - strokeWidth * 2) / 2}
        strokeLinecap="round"
        strokeDasharray={200}
        strokeDashoffset={200}
        transform={`rotate(-160 ${length / 2} ${length / 2})`}
        className={
          show ? "animate-[check-animation-circle_1s_ease-in-out_forwards]" : ""
        }
      />
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        points={`${length / 3.5},${length / 2} ${length / 2.4},${
          length / 1.6
        } ${length / 1.4},${length / 2.6}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={350}
        strokeDashoffset={350}
        className={
          show ? "animate-[check-animation-tick_1.5s_1s_ease-out_forwards]" : ""
        }
      />
    </svg>
  );
};

export default CheckAnimate;
