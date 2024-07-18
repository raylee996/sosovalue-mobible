import Image from "next/image";
import React from "react";
import { parseDetailData } from "helper/tools";
import { useTranslation } from "next-i18next";
import ArrowLeft from "components/icons/arrow-left.svg";
import ArrowRight from "components/icons/arrow-right.svg";
import { Pagination, PaginationItem } from "@mui/material";
const Investors = ({
  originalCurrencyDetail,
}: {
  originalCurrencyDetail?: API.OriginalCurrencyDetail;
}) => {
  const [pageNum, setPageNum] = React.useState(1);
  const investors = React.useMemo(
    () =>
      parseDetailData<API.Investor[]>([], originalCurrencyDetail?.investors),
    [originalCurrencyDetail]
  );

  const { t } = useTranslation("home");
  return (
    <div className="p-4 rounded-xl border border-solid border-primary-100-700 text-primary-900-white">
      <div className=" text-lg font-bold leading-8 mb-4">{t("Investors")}</div>
      <div className={`rounded-lg p-2 h-[512px]`}>
        {investors
          ?.slice(pageNum * 10 - 10, pageNum * 10)
          ?.map(({ logo, intro, name, category }, index) => (
            <div key={index} className="flex items-center h-12">
              <Image
                className={`${
                  category === 138 ? "rounded-full" : ""
                } rounded-[50%]`}
                src={logo || "/img/UserSquare.png"}
                width={24}
                height={24}
                alt=""
              />
              <div className="ml-2 flex flex-col justify-center">
                <span className="text-sm font-medium mr-2">{name}</span>
              </div>
            </div>
          ))}
      </div>
      <div className="mb-4">
        <Pagination
          count={Math.ceil(investors?.length / 10)}
          page={pageNum}
          onChange={(event: React.ChangeEvent<unknown>, pageNum: number) =>
            setPageNum(pageNum)
          }
          renderItem={(item) => (
            <PaginationItem
              className={`text-primary-900-white ${
                item.selected &&
                "rounded-lg border border-solid border-primary-100-700 bg-dropdown-White-800"
              }`}
              slots={{
                previous: () => <ArrowLeft className="text-primary-800-50" />,
                next: () => <ArrowRight className="text-primary-800-50" />,
              }}
              {...item}
            />
          )}
        />
      </div>
    </div>
  );
};

export default Investors;
