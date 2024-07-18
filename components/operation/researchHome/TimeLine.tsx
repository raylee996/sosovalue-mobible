import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineDotIcon from "components/icons/researcher/timeLine-HL.svg";
import TimelineIcon from "components/icons/researcher/timeLine-dark.svg";
import { useCountDown } from "ahooks";
import ClientRenderCheck from "components/base/ClientCheck";
import { useContext, useEffect, useState } from "react";
import {
  getActivitySign,
  getActivityTimeline,
  getArticleList,
} from "http/activity";
import dayjs from "dayjs";
import { UserContext } from "store/UserStore";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const list = [
  {
    id: "July 8th - July 25th",
    title: "Register",
    subTitle: "Coming Soon",
    time: "Ongoing (21D : 10H : 22M : 21S)",
    startTime: "2024-07-08T00:00:01Z",
    endTime: "2024-07-25T23:59:59Z",
    needOngoing: true,
    needDone: true,
  },
  {
    id: "July 8th - July 28th",
    title: "Submit Thesis",
    subTitle: "After Register",
    startTime: "2024-07-08T00:00:01Z",
    endTime: "2024-07-28T23:59:59Z",
    needOngoing: true,
    needDone: true,
  },
  {
    id: "July 29th - July 31st",
    title: "Initial Selection",
    subTitle: "After Submit",
    startTime: "2024-07-29T00:00:01Z",
    endTime: "2024-07-31T23:59:59Z",
    needOngoing: false,
    needDone: false,
  },
  {
    id: "Aug. 1st - Aug. 9th",
    title: "Top 100 Battle",
    subTitle: "After Submit",
    startTime: "2024-08-01T00:00:01Z",
    endTime: "2024-08-09T23:59:59Z",
    needOngoing: true,
    needDone: false,
  },
  {
    id: "Aug. 10th - Aug. 14th",
    title: "Final Battle",
    subTitle: "After Top 100 Battle",
    startTime: "2024-8-10T00:00:01Z",
    endTime: "2024-08-14T23:59:59Z",
    needOngoing: true,
    needDone: false,
  },
  {
    id: "Aug. 15th - Aug. 31st",
    title: "Award Ceremony",
    subTitle: "After Final Battle",
    startTime: "2024-08-15T00:00:01Z",
    endTime: "2024-08-31T23:59:59Z",
    needOngoing: false,
    needDone: false,
  },
];

const HLIcon = ({ item, status, idx }: any) => {
  return +item.endTime >= Date.now() &&
    +item.startTime <= Date.now() &&
    !(status || (idx > 1 && item.needDone)) ? (
    <TimelineDotIcon />
  ) : (
    <TimelineIcon />
  );
};

const StatusBadge = ({ item, status, idx }: any) => {
  const [countdown, formattedRes] = useCountDown({
    targetDate: +item.endTime,
    onEnd: async () => {},
  });

  return (
    <div className="pt-3 flex flex-col gap-2">
      <div className="text-[#525252] text-sm">
        {dayjs(+item.startTime).utc().format("MMM D")} -{" "}
        {dayjs(+item.endTime).utc().format("MMM D")}
      </div>
      <div
        className={`text-[#0A0A0A] text-base ${+item.endTime >= Date.now() && +item.startTime <= Date.now() && !(status || (idx > 1 && item.needDone)) && "font-bold"}`}
      >
        {item.title}
      </div>
      {/* 未开始状态 */}
      {+item.startTime > Date.now() ? null : +item.endTime < Date.now() ? ( // <div className="text-[#737373] text-sm !font-ddin">{item.subTitle}</div>
        <div className="text-[#737373] text-sm !font-ddin">Ended</div>
      ) : status || (idx > 1 && item.needDone) ? (
        <div className="text-[#00AE1A] text-sm !font-ddin">Done</div>
      ) : (
        <ClientRenderCheck>
          <div className="text-[#FF4F20] text-xl font-bold !font-ddin">
            Ongoing
            {item.needOngoing ? (
              <span className="ml-1">
                ({formattedRes.days}D : {formattedRes.hours}H :{" "}
                {formattedRes.minutes}M : {formattedRes.seconds}S)
              </span>
            ) : null}
          </div>
        </ClientRenderCheck>
      )}
    </div>
  );
};

const TimeLines = () => {
  const { user } = useContext(UserContext);
  const [timeLines, setTimeLines] = useState<any[]>([]);
  const [status, setStatus] = useState<boolean[]>([
    true,
    false,
    false,
    false,
    false,
    false,
  ]);

  const getTimeLines = async () => {
    setTimeLines([]);
    const { data } = await getActivityTimeline();
    setTimeLines(list.map((item, idx) => ({ ...item, ...(data as any)[idx] })));
  };

  useEffect(() => {
    if (user) {
      Promise.all([
        getActivitySign(),
        getArticleList({ userId: user.id, status: 2 }),
      ]).then(([res1, res2]: any) => {
        if (res2.data?.length) {
          setStatus([true, true, false, false, false, false]);
        } else if (res1.data?.id) {
          setStatus([true, false, false, false, false, false]);
        } else {
          setStatus([false, false, false, false, false, false]);
        }
      });
    } else {
      setStatus([false, false, false, false, false, false]);
    }
  }, [user]);

  useEffect(() => {
    getTimeLines();
  }, []);
  return (
    <div className="w-full base:w-[400px] p-4 bg-[#FFF] rounded-2xl">
      <div className="font-bold text-2xl leading-[29px] text-[#0a0a0a] pl-4">
        Timeline
        <span className="text-[#737373] text-base ml-[10px]">UTC+0</span>
      </div>

      <div className="py-4">
        {timeLines.map((item, index) => (
          <Timeline className="m-0 p-0" key={item.id + index}>
            <TimelineItem
              className="px-3"
              classes={{ missingOppositeContent: "before:hidden" }}
            >
              <TimelineSeparator className="mr-3">
                {/* <TimelineDot className="p-0 mb-2 mt-3 shadow-none border border-solid border-[#E5E5E5]"> */}
                <TimelineDot className="p-0 mb-2 mt-5 shadow-none border-none">
                  <HLIcon
                    key={item.id + index}
                    item={item}
                    status={status[index]}
                    idx={index}
                  />
                </TimelineDot>
                {index < 5 && (
                  <TimelineConnector className="bg-[#e5e5e5] -mb-2 min-h-[60px]" />
                )}
              </TimelineSeparator>
              <TimelineContent className={`p-0 flex-1 w-0 `}>
                <StatusBadge
                  key={item.id + index}
                  item={item}
                  status={status[index]}
                  idx={index}
                />
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        ))}
      </div>
    </div>
  );
};

export default TimeLines;
