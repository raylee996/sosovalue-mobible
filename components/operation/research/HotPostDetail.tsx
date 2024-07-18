import { useHotPost } from "hooks/operation/useHotPost";
import HotPostMain from "./HotPostMain";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import { usePost } from "hooks/operation/usePost";
import { useTranslation } from "next-i18next";
import ExportIcon from "components/icons/export.svg";
import { Category } from "./FilterResearch";
import { useState } from "react";

const HotPostDetail = ({
  post,
  changeCategory,
  createExportData
}: {
  post?: Research.ClusterNews;
  changeCategory?: (category: Category) => void;
  createExportData?:(data:any)=>({[key:string]:string})
}) => {
  const { t } = useTranslation("research");
  const { createPost } = usePost();
  const [expanded, setExpanded] = useState(true);
  const {
    post: { raw },
    relatedInsights,
  } = useHotPost({ post, needRelatedInsights: true });

  const informationDoVos = raw?.informationDoVos || [];
  return (
    <div>
      <HotPostMain post={post} />
      <Accordion
        className="bg-transparent bg-none mt-0 shadow-none before:hidden"
        expanded={expanded}
        onChange={(e: React.SyntheticEvent, expanded: boolean) =>
          setExpanded(expanded)
        }
      >
        <AccordionSummary
          classes={{ content: "bg-transparent my-0 h-full" }}
          className=" h-12 min-h-[48px] px-0 my-0"
          expandIcon={<ExpandMoreIcon className=" text-primary-900-White" />}
        >
          <div className="flex items-center pr-2 w-full h-full justify-between">
            <span className="text-primary-900-White text-lg font-bold">
              {t("Source")}
            </span>
            <span className="text-primary-900-white text-sm font-medium">
              {!expanded ? t("View More") : t("Less")}
            </span>
          </div>
        </AccordionSummary>
        <AccordionDetails className="rounded-xl border border-solid border-primary-100-700 px-5 py-4">
          <div className="flex flex-col gap-y-3">
            {informationDoVos.map((item, index: number) => {
              const { title } = createPost(item);
              return (
                <div
                  key={item.id}
                  className="text-sm text-primary-900-White whitespace-nowrap truncate"
                >
                  {item.author}:<Link href={`/news/${item.id}`}>{title}</Link>
                </div>
              );
            })}
          </div>
        </AccordionDetails>
      </Accordion>
      {!!relatedInsights.length && (
        <div>
          <h3 className="text-lg text-primary-900-White font-bold my-4">
            {t("Related Insights")}
          </h3>
          <div className="rounded-xl border border-solid border-primary-100-700">
            {relatedInsights.map((item, index) => {
              return (
                <div key={index + "xxx"}>
                  <h4 className="my-0 px-5 h-12 flex items-center justify-between border-0 border-b border-solid border-primary-100-700">
                    <span className="text-xs text-primary-900-White border border-solid border-primary-100-700 rounded-lg px-2 py-1">
                      #{item.sector}
                    </span>
                    <Link
                      href={`/research?category=${Category.Insights}&search=${item.sector}`}
                      onClick={() => changeCategory?.(Category.Insights)}
                    >
                      <IconButton className=" text-primary-800-50">
                        <ExportIcon />
                      </IconButton>
                    </Link>
                  </h4>
                  <div
                    className={`${
                      index + 1 < relatedInsights?.length &&
                      "border-0 border-b border-solid border-primary-100-700"
                    }`}
                  >
                    {item.newsList.map((news, idx) => {
                      const { title, Sector, MatchedCurrency, FinalContent } =
                        createPost(news);
                      return (
                        <div
                          key={idx + "nenws"}
                          {...createExportData?.(`${news.id}-${idx}-relatedInsights_${item.sector}`)}
                          className={`py-4 px-5 ${
                            idx > 0 &&
                            "border-0 border-t border-solid border-primary-100-700"
                          }`}
                        >
                          <Link
                            href={`/news/${news.id}`}
                            className=" no-underline"
                          >
                            {title && (
                              <div
                                className="text-base font-bold text-primary-900-White mb-2"
                                dangerouslySetInnerHTML={{ __html: title }}
                              ></div>
                            )}
                            <div className="my-2 text-sm text-primary-900-White">
                              <FinalContent />
                            </div>
                          </Link>
                          <div className="flex items-center">
                            <Sector />
                            <MatchedCurrency />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotPostDetail;
