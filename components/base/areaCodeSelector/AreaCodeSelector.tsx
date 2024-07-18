import { Drawer, Popover } from "@mui/material";
import { useMemo, useState } from "react";
import type { AreaCodeSelectorProps, SelectorItemData } from "./type";
import { cn } from "helper/cn";
import { useControlled } from "hooks/useController";
import SelectorPanel from './SelectorPanel'
import countries from "./countries";
import Image from "next/image";

const AreaCodeSelector: React.FC<AreaCodeSelectorProps> = ({
  onChange,
  onClick,
  className,
  defaultValue,
  value: valueProp,
  hasRightBorder = false,
  ...rest
}) => {
  const [value, setValue] = useControlled({
    controlled: valueProp,
    default: defaultValue,
  })
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const handleChange = (item: SelectorItemData) => {
    setValue(item.areaCode)
    onChange?.(item);
    handlePopoverClose();
  };
  const currentCountry = useMemo(() => {
    return countries.find((data) => data.areaCode === value);
  }, [value])

  const rightBorderClasses =
    "relative after:content-[''] after:bg-secondary-500-300 after:w-[1px] after:h-1/3 after:absolute after:left-full after:top-1/2 after:-translate-y-1/2";
  
  return (
    <div
      className={cn(
        "flex h-full",
        { [rightBorderClasses]: hasRightBorder },
        className
      )}
    >
      <div
        className="flex justify-center items-center py-2 px-4 cursor-pointer min-w-[60px] text-primary-900-White text-sm"
        onClick={handleClickListItem}
        {...rest}
      >
        {currentCountry ? (
          <div className="whitespace-nowrap flex items-center space-x-1">
            <Image
              width={24}
              height={17}
              className="rounded-sm"
              src={`/img/country-flags/${currentCountry.countryCode.toLowerCase()}.png`}
              alt={currentCountry.countryCode}
            />
            <span>+{currentCountry.areaCode}</span>
          </div>
        ) : (
          ""
        )}
      </div>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={handlePopoverClose}
        classes={{
            root: "z-[1502]",
            paper: "bg-dropdown-White-800 rounded-t-xl h-[70vh]",
        }}
      >
        <SelectorPanel value={value} onChange={handleChange} />
      </Drawer>
      {/* <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        className="z-[1502] max-w-[300px]"
        classes={{ paper: "bg-transparent mt-2" }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <SelectorPanel value={value} onChange={handleChange} />
      </Popover> */}
    </div>
  );
};

export default AreaCodeSelector;
