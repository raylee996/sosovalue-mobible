import { useMemo, useState } from "react";
import InputSearch from "../InputSearch";
import SelectorItem from "./SelectorItem";
import countries from "./countries";
import type { SelectorItemData, SelectorPanelProps } from "./type";
import { useRouter } from "next/router";
import { Language } from "store/ThemeStore";

const SelectorPanel: React.FC<SelectorPanelProps> = ({ value, onChange }) => {
  const [searchKeywords, setSearchKeywords] = useState("");
  const router = useRouter();
  const handleItemClick = (item: SelectorItemData) => {
    onChange?.(item);
  };
  const selectedCountry = useMemo(
    () => countries.find((data) => data.areaCode === value),
    [value]
  );
  const unSelectedCountries = useMemo(() => countries.filter((data) => data.areaCode !== value), [value]);
  const filterCountries = useMemo(() => {
    if (!searchKeywords.replace(/\s/g, "")) return unSelectedCountries;
    const withoutPlusKey = searchKeywords.replace(/^\+/, "");
    return unSelectedCountries.filter((data) => {
      return (
        data.countryCode.toLowerCase().includes(withoutPlusKey.toLowerCase()) ||
        data.countryName[router.locale as Language].toLowerCase().includes(withoutPlusKey.toLowerCase()) ||
        data.areaCode.includes(withoutPlusKey)
      );
    });
  }, [searchKeywords, unSelectedCountries]);

  return (
    <div className="flex flex-col py-4 bg-dropdown-White-800 overflow-y-auto rounded-lg p-2 border border-solid border-primary-100-700 overflow-hidden text-sm">

      <div className="">
        <InputSearch onChange={e => setSearchKeywords(e.target.value)} />

        {!!selectedCountry && (
          <div className="mt-2 border-b border-solid border-x-0 border-t-0 border-primary-100-700">
            <SelectorItem data={selectedCountry} className="cursor-default !bg-neutral-bg-1-rest" />
          </div>
        )}
      </div>

      <div className="py-2 flex-1 overflow-y-auto overflow-x-hidden">
          {filterCountries.map((data) => (
            <SelectorItem
              key={data.countryCode}
              selected={value === data.areaCode}
              data={data}
              onClick={() => handleItemClick(data)}
            />
          ))}
        </div>
    </div>
  );
};

export default SelectorPanel;
