import { OpenAiLogo } from "@phosphor-icons/react";
import GPTIcon from "components/icons/gpt.svg";
import { useHotPost } from "hooks/operation/useHotPost";

const HotPostMain = ({ post }: { post?: Research.ClusterNews }) => {
  const {
    post: {
      translateTip,
      title,
      content,
      Sector,
      MatchedCurrency,
      formatedTime,
    },
  } = useHotPost({ post });
  return (
    <div>
      {translateTip && (
        <div className="flex items-center mb-3">
          {/* <GPTIcon /> */}
          {/* 暂时代替下 没查到原因 分享一阔以 */}
          <OpenAiLogo size={18} color="var(--primary-900-White)" />
          <span className="text-xs text-secondary-500-300 ml-1 xxs">
            {translateTip}
          </span>
        </div>
      )}
      <div className="text-xl text-primary-900-White font-bold mb-6">
        {title}
      </div>
      <div className="flex items-center">
        <span className="text-xs text-secondary-500-300 mt-0.5">
          {formatedTime}
        </span>
      </div>
      <div className="flex items-center mt-4 mb-6">
        <Sector />
        <MatchedCurrency />
      </div>
      <div className="border-0 py-4 border-t border-solid border-primary-100-700 !font-inter post-detail text-primary-900-White text-sm">
        {content}
      </div>
    </div>
  );
};

export default HotPostMain;
