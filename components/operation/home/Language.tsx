import { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import { Language, ThemeContext } from "store/ThemeStore";
import { useRouter } from "next/router";
import { trackChangeLanguage } from "helper/track";
import { telegramHelper } from "helper/telegram";
import { getLang as getStorageLang } from "helper/storage";
import { TelegramHelperEventName } from "helper/telegram/observer";

const languageMap = [
  { key: Language.EN, name: "English", tag: "EN", hidden: false },
  { key: Language.ZH, name: "简体中文", tag: "ZH", hidden: false },
  { key: Language.TC, name: "繁体中文", tag: "TC", hidden: false },
  { key: Language.JA, name: "日本語", tag: "JA", hidden: false },
];

const Banner = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeLang, setActiveLang] = useState<Language>(Language.EN);
  const { changeLang } = useContext(ThemeContext);
  const lang = useRouter().locale as Language;
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleChange = (activeLang: Language) => {
    trackChangeLanguage(activeLang);
    changeLang(activeLang);
    setActiveLang(activeLang);
    handleClose();
  };
  const getTag = () => {
    const languageEntry = languageMap.find((entry) => entry.key === lang);
    return languageEntry?.tag || "";
  };
  useEffect(() => {
    setActiveLang(lang);
  }, [lang]);
  useEffect(() => {
    if (getStorageLang()) return;
  }, []);

  return (
    <div className="relative flex items-center">
      <Button
        onClick={handleOpen}
        className="h-6 min-w-[40px] whitespace-nowrap text-sm text-[#8F8F8F] normal-case rounded border border-[#8F8F8F] border-solid bg-transparent"
      >
        {getTag()}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        classes={{
          paper:
            "w-[140px] -translate-x-9 mt-1 bg-[#252525]/[.82]  rounded-xl  shadow-[0_0_32px_0_rgba(0,0,0,0.2)] backdrop-blur-[75px]",
          list: "py-0",
        }}
      >
        {languageMap.map((item) => {
          return !item.hidden ? (
            <MenuItem
              key={item.key}
              className={`font-normal text-base  ${
                item.key === activeLang ? "text-[#FF4F20]" : "text-[#F4F4F4]"
              } px-1.5 py-2.5`}
              onClick={() => handleChange(item.key)}
            >
              <span className="flex items-center justify-center w-4 mr-1.5">
                {item.key === activeLang && (
                  <Image
                    src="/img/svg/home/Check.svg"
                    width={20}
                    height={20}
                    alt=""
                  />
                )}
              </span>
              {item.name}
            </MenuItem>
          ) : null;
        })}
      </Menu>
    </div>
  );
};

export default Banner;
