import { Avatar, AvatarGroup, Button } from "@mui/material";
import { formatDate } from "helper/tools";
import { usePost } from "hooks/operation/usePost";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NewsItem = ({
  news,
  triggerSetHistory,onLinkClick
}: {
  news: Research.Post;
  triggerSetHistory: () => void;
  onLinkClick?:React.MouseEventHandler<HTMLElement>
}) => {
  const { post } = usePost({ post: news });
  const { title, content, timeAgoFormated, Sector, MatchedCurrency, raw } =
    post;
  const { id } = raw!;
  return (
    <Link
      href={`/news/${id}`}
      target="_blank"
      //onClick={() => toHotDetail(id)}
      onClick={onLinkClick}
      className="mb-4 pb-4 border-0 border-b border-solid border-secondary-50-800 no-underline flex flex-col"
    >
      <div
        className="text-base font-bold text-primary-900-White"
        dangerouslySetInnerHTML={{ __html: title || "" }}
      ></div>
      <div className="flex justify-start items-center mt-2">
        <Avatar
          className="h-5 w-5"
          src={news.authorAvatar || "/img/none.jpeg"}
        />
        <span className="ml-2 text-primary-900-White text-xs font-semibold">
          {raw?.author}
        </span>
        <span className="ml-2 text-secondary-500-300 text-xs">
          {timeAgoFormated}
        </span>
      </div>
      <div
        className="line-clamp-3 text-sm text-primary-900-White my-3"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
      <div className="flex items-center gap-x-1">
        <Sector className="mr-1" />
        <MatchedCurrency />
      </div>
    </Link>
  );
};

export default NewsItem;
