import { useMemo, useState } from "react";
import InfoSvg from "components/icons/info.svg";
import { ButtonBase, ClickAwayListener, Tooltip } from "@mui/material";
import { useTranslation } from "next-i18next";
// import { capitalizeFirstLetter } from "helper/tools";

type Props = { currencyInfo: any };

const InfoTooltip = ({ currencyInfo }: Props) => {
  const { t } = useTranslation(["home", "portfolio"]);
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const baseAsset = useMemo(() => {
    return currencyInfo?.symbolDoVO?.baseAsset || "";
  }, [currencyInfo]);

  const quoteAsset = useMemo(() => {
    return currencyInfo?.symbolDoVO?.quoteAsset || "";
  }, [currencyInfo]);

  const exchangeName = useMemo(() => {
    return currencyInfo?.symbolDoVO?.exchangeName || "";
  }, [currencyInfo]);
  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        PopperProps={{
          disablePortal: true,
        }}
        onClose={handleTooltipClose}
        open={open}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        placement="bottom"
        arrow
        classes={{
          tooltip:
            "p-2 bg-tooltip-800 mt-3 rounded-xl border border-solid border-primary-100-700 shadow",
          arrow: "text-tooltip-800",
        }}
        className="text-justify"
        title={
          <div className="flex items-center text-base flex-col gap-4 text-white-white">
            {t("Price and candlestick chart", {
              pairName: baseAsset + "/" + quoteAsset,
              exchangeName,
            })}
          </div>
        }
      >
        <ButtonBase
          onClick={() => setOpen(true)}
          className="flex justify-center items-center gap-2 rounded-xl"
        >
          <InfoSvg className=" text-placeholder-500-300" />
        </ButtonBase>
      </Tooltip>
    </ClickAwayListener>
  );
};

export default InfoTooltip;
