import React from "react";
import { useTranslation } from "next-i18next";
import { splitNum } from "helper/tools";
import { Divider } from "@mui/material";
const splitAmount = (str: string, index: number) => {
  if (!(index == 1 || index == 2)) {
    return str;
  }
  return str.replace(/(\d.*\.?\d.*?)/, (num) => splitNum(num));
};
const Finance = ({
  originalCurrencyDetail,
  fullName,
}: {
  originalCurrencyDetail?: API.OriginalCurrencyDetail;
  fullName: string;
}) => {
  const rounds = React.useMemo(() => {
    return (
      originalCurrencyDetail?.rounds
        ? JSON.parse(originalCurrencyDetail?.rounds)
        : { data: [] }
    ) as { data: string[][]; update_time: string };
  }, [originalCurrencyDetail]);
  const { t } = useTranslation("home");
  return (
    <div>
      <div className="w-full">
        <div className="flex items-center">
          <div className="text-primary-900-white font-bold text-xl leading-8 mb-4">
            <span>
              {fullName} {t("Financing history")}
            </span>
          </div>
        </div>
      </div>
      <div className="text-sm text-primary-900-white p-4 rounded-xl border border-solid border-primary-100-700">
        <div className="text-lg font-bold leading-8">{t("Funding Rounds")}</div>
        <div className="">
          {rounds.data.map((round, index) => {
            return (
              <div key={index}>
                <div className="p-2 mt-3">
                  {round.map((str, index) => (
                    <div
                      key={index}
                      className={`text-sm text-primary-900-White mb-2 text-left`}
                    >
                      <span className="font-bold mr-2">
                        {index === 0 && t("Round") + ":"}
                        {index === 1 && t("Amount") + ":"}
                        {index === 2 && t("Valuation") + ":"}
                        {index === 3 && t("Date") + ":"}
                        {index === 4 && t("Investors") + ":"}
                      </span>
                      {splitAmount(str, index)}
                    </div>
                  ))}
                </div>
                {rounds.data?.length !== index + 1 ? (
                  <Divider className="bg-primary-100-700" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Finance;
