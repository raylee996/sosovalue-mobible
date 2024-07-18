import {
  ButtonBase,
  Dialog,
  InputAdornment,
  Slide,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import SearchIcon from "components/icons/search.svg";
import CloseIcon from "components/icons/close.svg";
import {
  ReactElement,
  Ref,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "next-i18next";
import { useDebounceFn } from "ahooks";
import { globalSearch } from "http/home";
import SearchResult, { Category, createCategory, tabs } from "./SearchResult";
import Recommend from "components/operation/search/Recommend";
import {
  getSearchHistory,
  setSearchHistory,
  removeSearchHistory,
} from "helper/storage";
import dayjs from "dayjs";
import { TransitionProps } from "react-transition-group/Transition";
import NiceModal, { muiDialogV5, useModal } from "@ebay/nice-modal-react";
import { useRouter } from "next/router";
import { Nature } from "helper/link";
import { trackGlobalSearch } from "helper/track";

const SlideLeft = forwardRef(
  (
    props: TransitionProps & {
      children: ReactElement;
    },
    ref: Ref<unknown>
  ) => <Slide direction="left" ref={ref} {...props} />
);

type Props = {
  coin?: string;
  type?: string;
};

const SearchModal = NiceModal.create(({ coin, type }: Props) => {
  const modal = useModal();
  const router = useRouter();
  const { t } = useTranslation("common");
  const [keyword, setKeyword] = useState<string>(coin || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [tabValue, setTabValue] = useState(Category.All);
  const [category, setCategory] = useState<string[]>(createCategory(tabValue));
  const [isSearching, setIsSearching] = useState(false);

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
    const hasPairs = !!searchResult.pairs?.list?.filter(
      (i) => i.nature === Nature.CEX
    )?.length;
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
        trackGlobalSearch(keyword, tabValue);
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
  const handleHotClick = () => {
    modal.hide();
    router.push("/hot");
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

  useEffect(() => {
    const history = getSearchHistory() || [];
    const validTime = dayjs().subtract(7, "day");
    const filterHistory = history
      .filter((item) => validTime.isBefore(dayjs(+item.time)))
      .sort((prev, next) => Number(next.time) - Number(prev.time));
    setHistory(filterHistory.map((item) => item.value));
    setSearchHistory(filterHistory);
    trackGlobalSearch("","All")
  }, []);

  useEffect(() => {
    if (coin && type) {
      tabOnChange(type as Category);
    }
  }, [coin, type]);

  // a 标签跳转隐藏
  useEffect(() => {
    modal.hide();
  }, [router.asPath]);

  return (
    <Dialog fullScreen TransitionComponent={SlideLeft} {...muiDialogV5(modal)}>
      <div className="bg-dropdown-White-800 pt-4 h-full overflow-hidden flex flex-col items-stretch">
        <div className="relative px-4 mb-2 flex justify-between items-center gap-3">
          <TextField
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            className="w-full h-10 bg-background-primary-White-900 rounded-lg border border-solid border-primary-100-700"
            placeholder={t("Search") as string}
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
          <ButtonBase
            className="flex items-center justify-center w-9 h-9"
            onClick={() => modal.hide()}
          >
            <CloseIcon className="w-5 h-5 text-primary-800-50" />
          </ButtonBase>
        </div>
        <div className="border-0 border-b border-t border-solid border-primary-100-700 px-4">
          <Tabs
            value={tabValue}
            variant="scrollable"
            scrollButtons={false}
            onChange={(e, value: Category) => tabOnChange(value)}
          >
            {tabs.map(({ label }) => (
              <Tab
                key={label}
                label={t(label)}
                value={label}
                classes={{ selected: "text-accent-600" }}
                className="px-4 py-3 normal-case min-w-0 font-semibold text-sm text-primary-900-White"
              />
            ))}
          </Tabs>
        </div>
        <div className="flex-1 h-0 relative">
          {keyword ? (
            <div className="h-full overflow-y-auto">
              <SearchResult
                keyword={keyword}
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
              onHotClick={handleHotClick}
              history={history}
              onKeywordChange={onKeywordChange}
              removeHistory={removeHistory}
            />
          )}
        </div>
      </div>
    </Dialog>
  );
});

export default SearchModal;

// export async function getStaticProps({ locale }: { locale: string }) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ["common", "research"])),
//       // Will be passed to the page component as props
//     },
//   };
// }
