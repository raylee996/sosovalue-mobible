import { useCountDown } from "ahooks";
import ClientRenderCheck from "components/base/ClientCheck";
import dayjs from "dayjs";
import { splitNum } from "helper/tools";
import { getActivityExperience } from "http/activity";
import { useEffect, useState } from "react";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
const StatusBadge = ({ item, idx }: any) => {
  const [countdown, formattedRes] = useCountDown({
    targetDate: +item.endTime,
    onEnd: async () => {},
  });
  return (
    <div
      className={`p-6 ${idx < 2 && "border-0 border-b border-solid border-[#e5e5e5]"} ${+item.endTime < Date.now() && "opacity-50"}`}
    >
      {+item.endTime >= Date.now() && +item.startTime <= Date.now() ? (
        <>
          <ClientRenderCheck>
            <div className="text-[#ff4f20] !font-ddin text-xl font-bold">
              {/* Ongoing （{formattedRes.days}D : {formattedRes.hours}H :{" "}
                {formattedRes.minutes}M : {formattedRes.seconds}S） Sign up by{" "} */}
              Sign up by {dayjs(+item.endTime).utc().format("MMM D")}
            </div>
          </ClientRenderCheck>
          <div className="my-4 flex text-[#ff4f20] !font-ddin font-bold flex-nowrap items-end gap-2">
            <span className="text-[48px] leading-none">
              {splitNum(item.experienceVal)}
            </span>
            <span className="text-base">Brain EXP</span>
          </div>
        </>
      ) : (
        <div className="font-bold !font-ddin text-xl text-[#525252] mb-1">
          {dayjs(+item.startTime).utc().format("MMM D")} -{" "}
          {dayjs(+item.endTime).utc().format("MMM D")}
        </div>
      )}
      <div className="flex gap-3">
        <div className="pt-0.5">
          <span className="text-[#737373] !font-ddin text-xl base:text-2xl font-bold mr-1">
            {splitNum(item.experienceBase)}
          </span>
          <span className="!font-ddin text-[15px] text-[#737373] font-bold">
            🧠EXP
          </span>
        </div>

        <span className="h-[26px] leading-[26px] px-3 text-xl font-bold text-[#fff] italic rounded-full bg-[linear-gradient(95deg,#FF4F20_0%,#FF8438_100%)]">
          X{item.experienceMultiple * 100}%
        </span>
        {idx === 0 && <span className="text-base">⚡⚡⚡</span>}
        {idx === 1 && <span className="text-base">⚡⚡</span>}
        {idx === 2 && <span className="text-base">⚡</span>}
      </div>
    </div>
  );
};

const EarlyBird = () => {
  const [list, setList] = useState<any[]>([]);

  const getExp = async () => {
    setList([]);
    const { data } = await getActivityExperience({ experienceType: 1 });
    setList(data as any);
  };

  useEffect(() => {
    getExp();
  }, []);

  return (
    <div className="p-4 bg-[#FEFEFE] rounded-2xl">
      <div className="text-2xl text-[#0A0A0A] font-bold ">Early Bird Boost</div>
      <div className="mt-1 mb-4 text-base text-[#0A0A0A]">
        Sign up early for extra Brain EXPs
      </div>
      <div className="bg-[rgba(245,245,245,0.50)] rounded-2xl">
        {list.map((item, index) => (
          <StatusBadge key={item.id + index} item={item} idx={index} />
        ))}
      </div>
    </div>
  );
};

export default EarlyBird;
