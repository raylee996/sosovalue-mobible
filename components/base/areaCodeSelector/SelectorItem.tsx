import { cn } from "helper/cn";
import { SelectorItemProps } from "./type";
import { useRouter } from "next/router";
import Image from "next/image";
import { Language } from "store/ThemeStore";

const SelectorItem: React.FC<SelectorItemProps> = ({
  data,
  selected,
  className,
  ...rest
}) => {
  const { areaCode, countryName } = data;
  const router = useRouter();
  const _countryName = countryName[router.locale as Language];

  return (
    <div
      className={cn(
        "flex items-center justify-between space-x-1 py-2 px-4 cursor-pointer text-primary-900-White",
        { "bg-neutral-bg-3-hover": selected },
        className,
      )}
      title={_countryName}
      {...rest}
    >
      <div className="flex space-x-1 items-center flex-1 whitespace-nowrap overflow-hidden">
        <Image width={24} height={17} className="rounded-sm" src={`/img/country-flags/${data.countryCode.toLowerCase()}.png`} alt={data.countryCode} loading="lazy" />
        <span className="text-ellipsis overflow-hidden">{_countryName}</span>
      </div>
      <span className="w-[52px] text-right">+{areaCode}</span>
    </div>
  );
};

export default SelectorItem;
