import Link from "next/link";
import { CSSProperties, ReactNode, useEffect, useMemo, useState } from "react";

interface Item {
  key: string;
  label: ReactNode;
  children?: ReactNode;
  link?: string;
}

interface Props {
  items: Item[];
  activeKey?: string;
  onChange?(key: string, index: number): void;
}

const Tabs = (props: Props) => {
  const { items, activeKey, onChange } = props;
  const [visitedKeys, setVisitedKeys] = useState<string[]>([]);

  useEffect(() => {
    if (activeKey !== undefined) {
      setVisitedKeys((prev) => [...prev, activeKey]);
    }
  }, [activeKey]);

  const activeIndex = useMemo(
    () => items.findIndex((x) => x.key === activeKey),
    [activeKey, items]
  );

  const bgStyle: CSSProperties = {
    transform: `translateX(${activeIndex * 100}%)`,
    width: `calc(${(1 / items.length) * 100}% - ${4 / items.length}px)`,
  };

  return (
    <>
      <div className="relative bg-hover-50-900 text-primary-900-White border-primary-100-700 text-sm w-full p-0.5 rounded-lg border border-solid justify-between items-center flex">
        {activeIndex >= 0 && (
          <span
            style={bgStyle}
            className="absolute left-0.5 transition ease-in-out border border-solid border-[transparent] h-7 rounded-lg justify-center items-center inline-flex bg-background-secondary-White-700 shadow"
          />
        )}
        {items.map((tab, index) =>
          tab.link ? (
            <Link
              href={tab.link}
              key={tab.key}
              className="bg-[transparent] no-underline relative w-full h-7 rounded-lg justify-center items-center inline-flex"
            >
              <span key={tab.key}>{tab.label}</span>
            </Link>
          ) : (
            <span
              key={tab.key}
              onClick={() => onChange?.(tab.key, index)}
              className="bg-[transparent] no-underline relative w-full h-7 rounded-lg justify-center items-center inline-flex"
            >
              {tab.label}
            </span>
          )
        )}
      </div>
      {activeIndex >= 0 &&
        items.some((x) => x.children) &&
        items.map((tab) => (
          <div
            key={tab.key}
            className={`${activeKey !== tab.key ? "hidden" : ""}`}
          >
            {visitedKeys.includes(tab.key) && tab.children}
          </div>
        ))}
    </>
  );
};

export default Tabs;
