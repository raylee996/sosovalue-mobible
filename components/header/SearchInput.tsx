import SearchIcon from "components/icons/search.svg";
import SearchModal from "components/operation/search/index";
import NiceModal from "@ebay/nice-modal-react";
import { ButtonBase } from "@mui/material";
import { useTranslation } from "next-i18next";
import { localeType } from "store/ThemeStore";
interface Props {
  className?: string;
}

const Search = (props: Props) => {
  const { t } = useTranslation(localeType.COMMON);
  const { className } = props;

  const handleClick = () => {
    NiceModal.show(SearchModal);
  };

  return (
    <ButtonBase
      onClick={handleClick}
      className={`h-9 px-4 py-2 text-primary-800-50 border-primary-100-700 rounded-lg border justify-start items-center gap-2 inline-flex border-solid ${className}`}
    >
      <SearchIcon className="text-primary-800-50" />
      <div className="grow shrink basis-0 text-sm text-primary-900-White leading-tight text-left">
        {t("Search")}
      </div>
    </ButtonBase>
  );
};

export default Search;
