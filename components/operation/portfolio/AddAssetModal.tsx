import {
  ReactElement,
  Ref,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import NiceModal, { useModal, muiDialogV5 } from "@ebay/nice-modal-react";
import Dialog from "@mui/material/Dialog";
import ButtonBase from "@mui/material/ButtonBase";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import ArrowLeft from "components/icons/arrow-left.svg";
import SearchIcon from "components/icons/search.svg";
import CheckSvg from "components/icons/check.svg";
import CheckBox from "components/icons/Checkbox.svg";
import { InputAdornment, TextField } from "@mui/material";
import Image from "next/image";
import { getTopGainers } from "http/search";
import { useTranslation } from "next-i18next";
import useUserStore from "store/useUserStore";
import { useDebounceFn } from "ahooks";
import CollectMenu from "../user/CollectMenu";

const SlideLeft = forwardRef(
  (
    props: TransitionProps & {
      children: ReactElement;
    },
    ref: Ref<unknown>
  ) => <Slide direction="left" ref={ref} {...props} />
);

interface Props {
  curBackpackId: string;
}

const Index = NiceModal.create((props: Props) => {
  const modal = useModal();
  const { t } = useTranslation(["portfolio", "common"]);
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { collectCoins } = useUserStore();
  const [topGainers, setTopGainers] = useState<Market.TopGainer[]>([]);

  const onKeywordChange = (keyword: string) => {
    setKeyword(keyword);
    if (keyword) {
      setIsSearching(true);
      search({ keyword });
    } else {
      setKeyword("");
      search({ pageNum: 1, pageSize: 20 });
    }
  };

  const collectCoinIds = useMemo(
    () => collectCoins.map((i) => i.symbolId),
    [collectCoins]
  );

  const { run: search } = useDebounceFn(
    (params: API.CommonListParams & { keyword?: string }) => {
      getTopGainers(params).then((res) => {
        setTopGainers(res.data.list || []);
      });
    },
    { wait: 500 }
  );

  useEffect(() => {
    search({ pageNum: 1, pageSize: 20 });
  }, []);

  return (
    <Dialog fullScreen TransitionComponent={SlideLeft} {...muiDialogV5(modal)}>
      <header className="header-base text-center relative">
        <ButtonBase
          onClick={() => {
            modal.resolve();
            modal.hide();
          }}
          className="svg-icon-base text-primary-800-50 absolute left-4 top-2"
        >
          <ArrowLeft />
        </ButtonBase>
        <span className="h-9 inline-flex items-center text-primary-900-white font-bold">
          {t("Add New Assets")}
        </span>
      </header>
      <div className="bg-dropdown-White-800 text-primary-900-White text-sm h-full p-5 flex-col justify-start items-start gap-2 flex">
        <div className="relative mb-5 flex justify-between items-center gap-8 w-full">
          <TextField
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            className="w-full h-10 bg-background-primary-White-900 rounded-lg border border-solid border-primary-100-700"
            placeholder={t("Search coins or pairs") as string}
            inputRef={inputRef}
            autoComplete="off"
            InputProps={{
              classes: {
                root: "h-full",
                notchedOutline: "border-0",
                input: "text-base py-0 h-full text-primary-900-White",
              },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className=" text-primary-800-50" />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className=" text-primary-900-White text-sm font-semibold">
          {t("Top Gainers")}
        </div>
        <div className="h-full w-full">
          {topGainers?.length > 0 ? (
            topGainers.map((item, idx) => {
              return (
                <div
                  key={item.symbolId + idx}
                  className="flex items-center mb-5 w-full"
                >
                  <div className="flex-1 flex items-center gap-2">
                    <Image
                      src={item?.iconUrl || "/img/svg/CoinVertical.svg"}
                      width={24}
                      height={24}
                      alt=""
                    />
                    <div>
                      <div className="text-primaty-900-White text-sm font-semibold">
                        {item.baseAsset}
                      </div>
                      <div className="text-sm text-secondary-500-300">
                        {item.currencyFullName}
                      </div>
                    </div>
                  </div>
                  {collectCoinIds.includes(item.symbolId) ? (
                    <div className="rounded-lg py-2 px-4 flex items-center justify-center flex-shrink">
                      <CheckSvg className=" text-primary-800-50" />{" "}
                      <span className="text-sm text-secondary-500-300 ml-1">
                        {t("Added")}
                      </span>
                    </div>
                  ) : (
                    <CollectMenu
                      symbolId={item.symbolId}
                      className="rounded-lg py-2 px-4 flex items-center justify-center flex-shrink"
                      icon={<CheckBox className=" text-primary-800-50" />}
                    ></CollectMenu>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-primary-900-white text-base font-bold mt-4 h-full flex items-center justify-center">
              {t("No Relevant Result")}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
});

export default Index;
