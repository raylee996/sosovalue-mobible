import { IconButton, InputAdornment, TextField } from "@mui/material";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useDebounceFn } from "ahooks";
import { globalSearch } from "http/home";
import SearchResult, {
  Category,
  createCategory,
} from "components/operation/search/SearchResult";
import Recommend from "components/operation/search/Recommend";
import { MagnifyingGlass } from "@phosphor-icons/react";
import NavigateWrap from "components/layout/NavigateWrap";
import {
  getSearchHistory,
  setSearchHistory,
  removeSearchHistory,
} from "helper/storage";
import dayjs from "dayjs";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useNetwork } from "hooks/useNetwork";
import Loading from "components/operation/OptLoading";

const Search = () => {
  const { t } = useTranslation("common");
  const [keyword, setKeyword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [tabValue, setTabValue] = useState(Category.All);
  const [category, setCategory] = useState<string[]>(createCategory(tabValue));
  const [isSearching, setIsSearching] = useState(false);

  const networkState = useNetwork();
  const [load, setLoad] = useState(false);
  const [loadType, setLoadType] = useState(0);

  const tabOnChange = (label: Category) => {
    setTabValue(label);
    const category = createCategory(label);
    setCategory(category);
    setIsSearching(true);
    search({
      keyword,
      category,
      ...createPagination(label),
    });
  };
  const [searchResult, setSearchResult] = useState<Common.SearchResult>({});
  const hasResultMap = useMemo(() => {
    const hasCrypto = !!searchResult.crypto?.list?.length;
    const hasPairs = !!searchResult.pairs?.list?.length;
    const hasNews = !!searchResult.news?.list?.length;
    const hasResearch = !!searchResult.research?.list?.length;
    const hasInstitution = !!searchResult.institution?.list?.length;
    const hasInsights = !!searchResult.insights?.list?.length;
    const hasOnchain = !!searchResult.onChain?.list?.length;
    const hasResult =
      hasCrypto ||
      hasPairs ||
      hasNews ||
      hasResearch ||
      hasInstitution ||
      hasInsights ||
      hasOnchain;
    return {
      hasCrypto,
      hasPairs,
      hasNews,
      hasResearch,
      hasInstitution,
      hasInsights,
      hasResult,
      hasOnchain,
    };
  }, [searchResult]);
  const onKeywordChange = (keyword: string) => {
    setKeyword(keyword);
    if (keyword) {
      setIsSearching(true);
      search({ keyword, category });
    } else {
      reset();
    }
  };
  const reset = () => {
    setKeyword("");
    setTabValue(Category.All);
    setCategory(createCategory(Category.All));
    setSearchResult({});
  };
  const createPagination = (category: Category) =>
    category === Category.All
      ? { pageNum: 1, pageSize: 3 }
      : { pageNum: 1, pageSize: 50 };
  const { run: search } = useDebounceFn(
    (params: {
      keyword: string;
      category: string[];
      pageNum?: number;
      pageSize?: number;
    }) => {
      if (keyword) {
        globalSearch({ ...createPagination(tabValue), ...params }).then(
          (res) => {
            setSearchResult(res.data);
            setIsSearching(false);
          }
        );
      }
    },
    { wait: 500 }
  );
  const removeHistory = (value?: string) => {
    if (value) {
      let history = getSearchHistory() || [];
      const newHistory = history.filter((item) => item.value !== value);
      setSearchHistory(newHistory);
      setHistory(newHistory.map((item) => item.value));
    } else {
      removeSearchHistory();
      setHistory([]);
    }
  };
  const onClose = () => {
    setKeyword("");
    setTabValue(Category.All);
    setCategory(createCategory(Category.All));
    setSearchResult({});
  };
  const clear = () => {
    if (keyword) {
      reset();
    }
    setTabValue(Category.All);
  };
  const triggerSetHistory = () => {
    let history = getSearchHistory() || [];
    const hasRecord = history.some((item) => item.value === keyword);
    if (hasRecord) {
      history = history.map((item) =>
        item.value === keyword
          ? { ...item, time: String(dayjs().valueOf()) }
          : item
      );
    } else {
      history = history.concat({
        value: keyword,
        time: String(dayjs().valueOf()),
      });
    }
    setHistory(history.map((item) => item.value));
    setSearchHistory(history);
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoad(false);
  //   }, 500);
  // });

  useEffect(() => {
    if (!networkState.online) {
      setLoad(true);
      setLoadType(3);
    }
  }, [networkState]);

  useEffect(() => {
    const history = getSearchHistory() || [];
    const validTime = dayjs().subtract(7, "day");
    const filterHistory = history
      .filter((item) => validTime.isBefore(dayjs(+item.time)))
      .sort((prev, next) => Number(next.time) - Number(prev.time));
    setHistory(filterHistory.map((item) => item.value));
    setSearchHistory(filterHistory);
  }, []);
  return (
    <NavigateWrap>
      {load && <Loading type={loadType} />}
      <div className="pt-4 h-full overflow-hidden flex flex-col items-stretch">
        <div className="relative px-4 mb-2">
          <TextField
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            className="w-full h-10 bg-[#242424] rounded"
            placeholder={t("search") as string}
            inputRef={inputRef}
            autoComplete="off"
            InputProps={{
              classes: {
                root: "h-full",
                notchedOutline: "border-0",
                input: "text-white text-base font-bold py-0 h-full pr-12",
              },
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyingGlass
                    size={20}
                    className="text-white"
                  ></MagnifyingGlass>
                </InputAdornment>
              ),
            }}
          />
          {keyword && (
            <IconButton
              onClick={clear}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <Image src="/img/svg/X.svg" width={20} height={20} alt="" />
            </IconButton>
          )}
        </div>
        <div className="flex-1 h-0 relative">
          {keyword ? (
            <div className="h-full overflow-y-auto">
              <SearchResult
                isSearching={isSearching}
                searchResult={searchResult}
                category={tabValue}
                hasResultMap={hasResultMap}
                tabChange={tabOnChange}
                triggerSetHistory={triggerSetHistory}
              />
            </div>
          ) : (
            <Recommend
              history={history}
              onKeywordChange={onKeywordChange}
              removeHistory={removeHistory}
            />
          )}
        </div>
      </div>
    </NavigateWrap>
  );
};

export default Search;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "research"])),
      // Will be passed to the page component as props
    },
  };
}
