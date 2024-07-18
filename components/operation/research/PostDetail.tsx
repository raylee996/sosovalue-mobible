import { usePost } from "hooks/operation/usePost";
import TwitterIcon from "components/icons/tw-band.svg";
import GPTIcon from "components/icons/gpt.svg";
import Image from "next/image";

const PostDetail = ({ post }: { post?: Research.Post }) => {
  const {
    post: {
      isTwitter,
      title,
      FinalContent,
      releaseTimeFormated,
      authorAvatar,
      Sector,
      MatchedCurrency,
      translateTip,
      raw,
    },
  } = usePost({ post });
  return (
    <div>
      {isTwitter ? (
        <div className="flex items-center mb-3">
          <TwitterIcon />
          <span className="text-xs text-secondary-500-300 ml-1">Twitter</span>
        </div>
      ) : (
        <div className="flex items-center mb-3">
          {translateTip && <GPTIcon />}
          <span className="text-xs text-secondary-500-300 ml-1 xxx">
            {translateTip}
          </span>
        </div>
      )}
      <div className="text-xl text-primary-900-White font-bold mb-6">
        {title}
      </div>
      <div className="flex items-center">
        {authorAvatar && authorAvatar !== "null" && (
          <Image
            className="rounded-full mr-2"
            src={authorAvatar || ""}
            width={40}
            height={40}
            alt=""
          />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-primary-900-White">
            {raw?.author}
          </span>
          <span className="text-xs text-secondary-500-300 mt-0.5">
            {releaseTimeFormated}
          </span>
        </div>
      </div>
      <div className="flex items-center mt-4 mb-6">
        <Sector />
        <MatchedCurrency />
      </div>
      <div className="border-0 border-t border-solid border-primary-100-700 ">
        <FinalContent />
      </div>
    </div>
  );
};

export default PostDetail;
