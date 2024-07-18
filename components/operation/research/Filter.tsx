import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Popover,
  Radio,
  Rating,
  Switch,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import { useDebounceFn } from "ahooks";
import { globalSearch, sourcePlat } from "http/home";
import {
  ChangeEvent,
  MouseEvent,
  SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import dayjs, { Dayjs } from "dayjs";
import ArrowIcon from "components/svg/Arrow";
import { useTranslation } from "next-i18next";
import CloseIcon from "components/icons/close.svg";
import ArrowDownFill from "components/icons/arrow-down-fill.svg";
import SearchIcon from "components/icons/search.svg";
import { CategoryConfig } from "./FilterResearch";
import { useRouter } from "next/router";

export type FilterParams = {
  isOfficial?: 0 | 1;
  keyword?: string;
  search?: string;
  sourcePlatIdList?: string[];
  weight?: number;
  isAuth?: number;
  startTime?: number | null;
  endTime?: number | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  sourceConfig: { value: string; label: string }[];
  applyFilterParams: (params: FilterParams) => void;
  categoryConfig: CategoryConfig;
};

enum Period {
  Year1,
  Day90,
  Day30,
  Day7,
  Hour24,
}

const periods = [
  {
    label: "1Y",
    period: Period.Year1,
  },
  {
    label: "90D",
    period: Period.Day90,
  },
  {
    label: "30D",
    period: Period.Day30,
  },
  {
    label: "7D",
    period: Period.Day7,
  },
  {
    label: "24H",
    period: Period.Hour24,
  },
];

const returnWeightText = (categoryConfig: CategoryConfig) => {
  if (categoryConfig.isResearch) {
    return "Curated ";
  } else if (categoryConfig.isNews) {
    return "Important ";
  } else if (
    categoryConfig.isInstitution ||
    categoryConfig.isInsights ||
    categoryConfig.isOnchain ||
    categoryConfig.isTech ||
    categoryConfig.isProjectUpdate
  ) {
    return "Hot ";
  }
};

const Filter = ({
  onClose,
  open,
  sourceConfig,
  applyFilterParams,
  categoryConfig,
}: Props) => {
  const router = useRouter();
  const [selectToken, setSelectToken] = useState("");
  const [selectCrypto, setSelectCrypto] = useState<Common.SearchCrypto | null>(
    null
  );
  const [tokenOpen, setTokenOpen] = useState(false);
  const [cryptoes, setCryptoes] = useState<Common.SearchCrypto[]>([]);
  const [allNewsNum, setAllNewsNum] = useState(0);
  const [allCheck, setAllCheck] = useState(true);
  const [srcNumMap, setSrcNumMap] = useState<Record<string, string>>();
  const [sourcePlatIdList, setSourcePlatIdList] = useState<string[]>([]);
  const indeterminate = !!sourcePlatIdList.length && !allCheck;
  const [period, setPeriod] = useState(-1);
  const periodIndex = useMemo(
    () =>
      period === -1 ? 5 : periods.findIndex((item) => item.period === period),
    [period]
  );
  const [isOfficial, setIsOfficial] = useState(false);
  const [search, setSearch] = useState("");
  const [weight, setWeight] = useState(0.1);
  const onSelectTokenChange = (
    e: SyntheticEvent,
    crypto: Common.SearchCrypto | null
  ) => {
    setSelectCrypto(crypto);
    setSelectToken(crypto?.fullName || "");
    setTokenOpen(false);
    applyFilterParams({ keyword: crypto?.fullName });
  };
  const { t } = useTranslation(["research"]);
  const getSourceNum = async () => {
    const res = await sourcePlat({ useType: 1, pageSize: 1, weight: 0.1 });
    const allNewsNum = Object.values(res.data).reduce<number>(
      (a, b) => a + +b,
      0
    );
    setAllNewsNum(allNewsNum);
    setSrcNumMap(res.data);
  };
  const srcPlatChange = (checked: boolean, srcPlatId: string) => {
    const newValue = checked
      ? sourcePlatIdList.concat(srcPlatId)
      : sourcePlatIdList.filter((item) => item !== srcPlatId);
    setSourcePlatIdList(newValue);
    setAllCheck(sourceConfig.every((item) => newValue.includes(item.value)));
    applyFilterParams({ sourcePlatIdList: newValue });
  };
  const allCheckChange = (checked: boolean) => {
    setAllCheck(checked);
    if (checked) {
      setSourcePlatIdList(sourceConfig.map(({ value }) => value));
      applyFilterParams({ sourcePlatIdList: [] });
    } else {
      setSourcePlatIdList([]);
      applyFilterParams({ sourcePlatIdList: ["0"] });
    }
  };
  const { run: setFilterSearch } = useDebounceFn(
    (search: string) => {
      applyFilterParams({ search });
    },
    { wait: 300 }
  );
  const onTokenChange = (e: SyntheticEvent, token: string) => {
    setSelectToken(token);
    searchToken(token);
  };
  const onSearchChange = (value: string) => {
    setSearch(value);
    setFilterSearch(value);
  };
  const switchWeight = () => {
    const newWeight = weight === 0.1 ? 0.9 : 0.1;
    setWeight(newWeight);
    applyFilterParams({ weight: newWeight });
  };
  const onPeriodChange = (period: number) => {
    const today = dayjs();
    let startTime: number | null = null;
    let endTime: number | null = null;
    if (period === Period.Year1) {
      startTime = today.subtract(1, "year").valueOf();
    } else if (period === Period.Day90) {
      startTime = today.subtract(90, "day").valueOf();
    } else if (period === Period.Day30) {
      startTime = today.subtract(30, "day").valueOf();
    } else if (period === Period.Day7) {
      startTime = today.subtract(7, "day").valueOf();
    } else if (period === Period.Hour24) {
      startTime = today.subtract(1, "day").valueOf();
    }
    if (startTime) {
      endTime = today.valueOf();
    }
    setPeriod(period);
    applyFilterParams({ startTime, endTime });
  };
  const onIsOfficialChange = () => {
    setIsOfficial(!isOfficial);
    applyFilterParams({ isOfficial: !isOfficial ? 1 : undefined });
  };
  const { run: searchToken } = useDebounceFn(
    (tokenKeyword: string) => {
      globalSearch({
        category: ["crypto"],
        keyword: tokenKeyword,
        pageNum: 1,
        pageSize: 100,
      }).then((res) => {
        const cryptoes = res.data.crypto?.list || [];
        setCryptoes(cryptoes);
      });
    },
    { wait: 500 }
  );
  const clearSelectToken = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSelectToken("");
    setSelectCrypto(null);
    setCryptoes([]);
    applyFilterParams({ keyword: undefined });
  };
  const openSearchToken = () => {
    setTokenOpen(true);
  };
  const addSearchQuery = (search: string) => {
    if (!search) return;
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("search", search);
    router.push({ search: searchParams.toString() });
  }
  const clearSearchQuery = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("search");
    router.push({ search: searchParams.toString() });
  }
  
  const reset = () => {
    setSelectToken("");
    setSelectCrypto(null);
    setSearch("");
    setWeight(0.1);
    setIsOfficial(false);
    allCheckChange(true);
    setPeriod(-1);
    setAllCheck(true);
    setSourcePlatIdList(sourceConfig.map(({ value }) => value));
    applyFilterParams({
      keyword: "",
      search: "",
      weight: 0.1,
      isOfficial: undefined,
      startTime: undefined,
      endTime: undefined,
      sourcePlatIdList: [],
    });
    clearSearchQuery();
  };
  useEffect(() => {
    getSourceNum();
  }, []);
  useEffect(() => {
    if (sourceConfig.length) {
      setSourcePlatIdList(sourceConfig.map(({ value }) => value));
    }
  }, [sourceConfig]);
  useEffect(() => {
    if (router.query.search && typeof router.query.search === "string") {
      onSearchChange(router.query.search);
    }
  }, [router.query.search])
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      classes={{ paper: "left-0 bg-none" }}
    >
      <div className="h-12 p-2 relative flex items-center select-none ">
        <div className="p-2 cursor-pointer text-primary-900-White text-sm font-medium" onClick={reset}>{t("Reset")}</div>
        <span className="flex-1 text-center text-primary-900-White font-bold text-base">{t("Filter")}</span>
        <div className="p-2 cursor-pointer text-info text-sm font-medium" onClick={() => {
          onClose(); 
          addSearchQuery(search)}
        }>
            {t("Apply")}
        </div>
        {/* <IconButton
          onClick={onClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-900-White"
        >
          <CloseIcon />
        </IconButton> */}
      </div>
      <div className="p-4 border-0 border-t border-solid border-primary-100-700">
        <div className="relative flex items-center rounded-lg bg-hover-50-900 border border-solid border-primary-100-700">
          <i
            style={{ left: `${periodIndex * 16.66}%` }}
            className="absolute transition-[left] duration-500 top-0 w-[16.66%] h-full bg-background-secondary-White-700 rounded-lg shadow-[0px_4px_8px_0px_rgba(10,10,10,0.10),0px_2px_4px_0px_rgba(10,10,10,0.08)]"
          />
          {periods.map((item) => (
            <Button
              key={item.period}
              onClick={() => onPeriodChange(item.period)}
              className={`normal-case min-w-0 px-0 flex-1 h-8 text-sm text-primary-900-White`}
            >
              {t(item.label)}
            </Button>
          ))}
          <Button
            onClick={() => onPeriodChange(-1)}
            className={`normal-case min-w-0 px-0 flex-1 h-8 text-sm text-primary-900-White`}
          >
            {t("All")}
          </Button>
        </div>
        <div className="h-6 mt-4">
          <label className="flex items-center">
            <Checkbox
              sx={{ "& .MuiSvgIcon-root": { fontSize: 16 } }}
              className="p-0 text-primary-100-700"
              classes={{ checked: "!text-brand-accent-600-600" }}
              checked={weight === 0.9}
              onChange={switchWeight}
            />
            <span className="text-sm text-primary-900-White">
              ⚡️{t(returnWeightText(categoryConfig) as string)} {t("only")}
            </span>
          </label>
        </div>
        <div className="mt-4">
          <Autocomplete
            className="w-full"
            options={cryptoes || []}
            inputValue={selectToken}
            value={selectCrypto || null}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={onSelectTokenChange}
            onInputChange={onTokenChange}
            getOptionLabel={(option) => option?.name || option?.fullName || ""}
            renderOption={(props, option, state) => {
              return (
                <li
                  {...props}
                  key={option.id}
                  className="flex items-center p-2 mx-2 cursor-pointer hover:bg-[#6A6A6A]/[.16]"
                >
                  <Image
                    src={
                      option.iconUrl
                        ? option.iconUrl
                        : "/img/svg/CoinVertical.svg"
                    }
                    width={20}
                    height={20}
                    className="mr-4"
                    alt=""
                  />
                  <span className="text-sm text-primary-900-White mr-4">
                    {option?.name.toUpperCase()}
                  </span>
                  <span className="text-xs text-secondary-500-300">
                    {option?.fullName}
                  </span>
                </li>
              );
            }}
            renderInput={(params) => {
              const { InputProps, InputLabelProps } = params;
              return (
                <TextField
                  {...params}
                  InputProps={{
                    ...InputProps,
                    className: "h-9 text-sm pr-4",
                    classes: {
                      input:
                        "placeholder:text-sm placeholder:text-placeholder-400-300 placeholder:opacity-100",
                      notchedOutline:
                        "border-primary-100-700 rounded-lg border",
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton className="text-primary-800-50">
                          <ArrowDownFill className="w-4 h-4 text-primary-800-50" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& input:placeholder": {},
                  }}
                  fullWidth
                  placeholder={t("Select Token") as string}
                />
              );
            }}
          />
        </div>
        <div className="mt-4">
          <OutlinedInput
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 text-sm"
            sx={{
              "& input:placeholder": {},
            }}
            fullWidth
            classes={{
              input:
                "placeholder:text-sm placeholder:text-placeholder-400-300 placeholder:opacity-100",
              notchedOutline: "border-primary-100-700 rounded-lg border",
            }}
            placeholder={t("e.g. DeFi, DAO (optional)") as string}
            endAdornment={
              <InputAdornment position="end">
                <IconButton className="text-primary-800-50">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </div>
        <div className="flex items-center justify-between mt-4 h-5">
          <span className="text-sm font-semibold text-primary-900-White">
            {t("Source")}
          </span>
          <label className="flex items-center">
            <Switch
              onClick={onIsOfficialChange}
              checked={isOfficial}
              className="w-9 h-5 p-0"
              classes={{
                track: "rounded-full opacity-100 bg-primary-100-700",
                thumb: "w-4 h-4 text-white flex-shrink-0",
                switchBase: "p-[2px] transition-all",
                checked: "translate-x-0 pl-5 bg-accent-600 w-full rounded-full ",
              }}
            />
            <span className="text-xs text-primary-900-White ml-2">
              {t("Official Announcement")}
            </span>
          </label>
        </div>
        <div className="mt-4">
          <div className="flex flex-col gap-3 ">
            <FormControlLabel
              className="flex items-center col-span-1 rounded h-5 text-[#8F8F8F] font-normal m-0"
              control={
                <Checkbox
                  sx={{ "& .MuiSvgIcon-root": { fontSize: 16 } }}
                  indeterminate={indeterminate}
                  checked={allCheck}
                  onChange={(e) => allCheckChange(e.target.checked)}
                  classes={{
                    checked: "!text-brand-accent-600-600",
                    indeterminate: "!text-brand-accent-600-600",
                  }}
                  className=" text-primary-100-700 font-normal p-0 mr-2"
                />
              }
              label={
                <span className="whitespace-nowrap">
                  <span className="mr-2 text-sm text-primary-900-White">
                    {t("All")}
                  </span>
                  <span className="text-secondary-500-300 text-xs">
                    ({allNewsNum})
                  </span>
                </span>
              }
            />

            {sourceConfig.map(({ value, label }) => (
              <FormControlLabel
                key={value}
                className="flex items-center col-span-1 rounded h-5 text-[#8F8F8F] font-normal m-0"
                control={
                  <Checkbox
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 16 } }}
                    checked={sourcePlatIdList.includes(value)}
                    onChange={(e) => srcPlatChange(e.target.checked, value)}
                    classes={{ checked: "!text-brand-accent-600-600" }}
                    className=" text-primary-100-700 font-normal p-0 mr-2"
                  />
                }
                label={
                  <span className="whitespace-nowrap">
                    <span className="mr-2 text-sm text-primary-900-White">
                      {label}
                    </span>
                    <span className="text-secondary-500-300 text-xs">
                      ({srcNumMap?.[value]})
                    </span>
                  </span>
                }
              />
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default Filter;
