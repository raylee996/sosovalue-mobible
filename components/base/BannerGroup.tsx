import { ReactNode } from "react";

interface BannerInfo {
  title: ReactNode;
  content: ReactNode;
  description: ReactNode;
}

interface Props {
  group: BannerInfo[];
}

const BannerGroup = ({ group }: Props) => {
  return (
    <div className="p-3 h-full box-border flex">
      {group.map(({ title, content, description }, i) => (
        <div
          key={i}
          className="basis-1/2 flex flex-col gap-1 justify-between items-start"
        >
          <div className="text-secondary-500-300 whitespace-nowrap text-xs leading-tight font-bold">
            {title}
          </div>
          <div className="text-primary-900-White text-base font-bold leading-normal">
            {content}
          </div>
          <div className="text-secondary-500-300 text-xs leading-none">
            {description}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BannerGroup;
