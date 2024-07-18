import * as React from "react";
import { useRouter } from "next/router";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Tooltip from "@mui/material/Tooltip";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import { timeLine } from "http/etf";
import { truncate } from "fs/promises";
import dayjs from "dayjs";
const TimeLine = () => {
  const router = useRouter();
  const [initData, setInitData] = React.useState<API.timeLine[]>([]);
  const getTimeLine = async () => {
    const { data } = await timeLine({
      isListing: 0,
      orderItems: [
        {
          asc: true,
          column: "approve_time",
        },
      ],
      pageNum: 1,
      pageSize: 500,
    });

    const init = data.list.map((item: any, index: number) => {
      return {
        id: index + 1,
        approveTime: item.approveTime,
        inst: item.inst,
        name: item.name,
        timeZone: item?.timeZone,
      };
    });
    setInitData(init);
  };

  React.useEffect(() => {
    getTimeLine();
  }, [router.locale]);
  return (
    <Timeline
      className="p-0 m-0"
      sx={{
        [`& .${timelineOppositeContentClasses.root}`]: {
          padding: 0,
          margin: 0,
        },
      }}
    >
      {initData.map((item, index) => {
        return (
          <TimelineItem key={index} className="flex justify-start gap-4 min-h-[68px]">
            <TimelineSeparator className="inline-flex gap-2">
              <TimelineConnector className="bg-primary-100-700 grow-0 h-[16px]" />
              <TimelineDot
                className={`w-2 h-2 m-0 ${
                  index === 0
                    ? "bg-accent-600"
                    : "bg-primary-100-700"
                }`}
              />
              {index < initData.length - 1 && (
                <TimelineConnector className="bg-primary-100-700" />
              )}
            </TimelineSeparator>
            <TimelineOppositeContent className="flex flex-col gap-1 justify-start items-start align-left">
              <div className="text-secondary-500-300 text-xs font-semibold">
                {dayjs(item.approveTime).format("YYYY/MM/DD")} {item.timeZone}
              </div>
              <div className="text-primary-900-White text-sm font-semibold leading-5">
                {item.name}
              </div>
              <div className="text-secondary-500-300 text-xs font-normal leading-4">
                {item.inst}
              </div>
            </TimelineOppositeContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};

export default TimeLine;
