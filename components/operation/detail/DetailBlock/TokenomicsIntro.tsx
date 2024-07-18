import React from "react";
import { useTranslation } from "next-i18next";
const Finance = ({
  originalCurrencyDetail,
}: {
  originalCurrencyDetail?: API.OriginalCurrencyDetail;
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
    <div className="border border-solid border-primary-100-700 rounded-xl px-5 py-4">
      <div className=" text-primary-900-White text-lg font-bold mb-1 leading-8">
        {t("Q&A about Tokenomics")}
      </div>
      <div
        className="text-xs text-secondary-500-300 whitespace-pre-line text-justify token-economics"
        dangerouslySetInnerHTML={{
          __html: originalCurrencyDetail?.tokenomicsIntro || "",
        }}
      ></div>
    </div>
  );
};

export default Finance;
