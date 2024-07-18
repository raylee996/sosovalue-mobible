import React, { useContext, useState } from "react";
import { DotsThree } from "@phosphor-icons/react";
import { Button, Link, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import dayjs from "dayjs";
import { UserContext } from "store/UserStore";
import { useRouter } from "next/router";
import { deleteArticle } from "http/activity";
import useNotistack from "hooks/useNotistack";
type Props = {
  item: any;
};
const ListItem = ({ item }: Props) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const { error, success } = useNotistack();
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const menu = [{ name: "Edit" }, { name: "Preview" }, { name: "Delete" }];
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const renderTrackType = (trackType: number) => {
    if (trackType === 1) {
      return "BTC Analysis";
    }
    if (trackType === 2) {
      return "Sector Analysis";
    }
    if (trackType === 2) {
      return "Other Tokens/Projects";
    }
    return "";
  };
  const edit = (id: string) => {
    router.push(`/researcher-scholarship-s2/${id}`);
  };
  const preview = (id: string) => {
    router.push(`/research/preview/${id}`);
  };
  const renderItem = (status: number) => {
    if (status === 0) {
      return <></>;
    }
    return (
      <div className="px-5 py-4 border border-solid border-[#E5E5E5] rounded-2xl mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span
              className={`${item.status === 1 ? "bg-[#DA2E21]" : "bg-[#12A10F]"} text-[#FFF] text-xs rounded-lg px-2 leading-4 !font-lato mr-2`}
            >
              {item.status > 1 ? "Submitted" : "Draft"}
            </span>

            {item.trackType !== 0 && (
              <span className="bg-[#FFF7F5] border border-solid border-[#FFEDE9] text-[#FF4F20] text-xs rounded-lg px-2 leading-4 !font-lato">
                {item.label}
                {renderTrackType(item.trackType)}
              </span>
            )}
          </div>

          <div className="relative cursor-pointer ">
            {/* <Button
              onClick={handleClick}
              className={`h-[20px] p-0 m-0 min-w-[30px]`}
              endIcon={
                <Image
                  src="/img/researcherHub/ellipsis.svg"
                  width={16}
                  height={16}
                  alt=""
                />
              }
            ></Button> */}
            {/* <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              classes={{
                paper:
                  "mt-6 border border-solid border-[#E5E5E5] rounded-xl bg-[#FFF] shadow-[0_10px_16px_-3_rgba(10,10,10,0.1),0_4px_6px_0_rgba(10,10,10,0.04)]",
                list: "py-2",
              }}
            >
              <MenuItem
                className="text-sm text-[#0A0A0A] !font-lato my-1 px-5 py-2 leading-6"
                onClick={() => {
                  edit(item.id);
                }}
              >
                Edit
              </MenuItem>
              {item.status === 1 && (
                <MenuItem
                  className="text-sm text-[#0A0A0A] !font-lato my-1 px-5 py-2 leading-6"
                  onClick={() => {
                    preview(item.id);
                  }}
                >
                  Preview
                </MenuItem>
              )}
              {item.status === 1 && (
                <MenuItem
                  className="text-sm text-[#0A0A0A] !font-lato my-1 px-5 py-2 leading-6"
                  onClick={() => {
                    deleteTheArticle(item.id);
                    handleClose();
                  }}
                >
                  Delete
                </MenuItem>
              )}
              {item.status > 1 && (
                <MenuItem
                  className="text-sm text-[#0A0A0A] !font-lato my-1 px-5 py-2 leading-6"
                  disabled
                >
                  Delete
                </MenuItem>
              )}
             
            </Menu> */}
            {/* <Image
            src="/img/researcherHub/ellipsis.svg"
            width={16}
            height={16}
            alt="ellipsis"
            onClick={() => setIsShow(!isShow)}
          />

          {isShow && (
            <div className="absolute z-10 top-6 right-0 bg-[#fff]  rounded-lg border border-solid border-[#E5E5E5]">
              <ul className="list-none m-0 p-0">
                <Link
                  href={`/researcher-scholarship-s2/${item.id}`}
                  className="no-underline"
                >
                  <li className="text-sm w-[82px] px-4 h-[40px] text-[#000000] leading-10 cursor-pointer border-0">
                    Edit
                  </li>
                </Link>
                <Link
                  href={`/researcher-scholarship-s2/${item.id}`}
                  className="no-underline"
                >
                  <li className="text-sm w-[82px] px-4 h-[40px] text-[#000000] leading-10 cursor-pointer border-0 border-t border-solid border-[#E5E5E5]">
                    Preview
                  </li>
                </Link>
                <li
                  onClick={() => deleteTheArticle(item.id)}
                  className="text-sm w-[82px] px-4 h-[40px] text-[#000000] leading-10 cursor-pointer border-0 border-t border-solid border-[#E5E5E5]"
                >
                  Delete
                </li>
              </ul>
            </div>
          )} */}
          </div>
        </div>
        <h2 className="relative mx-0 my-2  flex justify-between w-full">
          <div className="flex-1 text-base text-[#0A0A0A] font-bold leading-6 line-clamp-2 !font-lato">
            {item?.title || "Empty title..."}
          </div>
        </h2>
        <div className="flex justify-between my-2">
          <p
            className="text-sm text-[#0A0A0A] line-clamp-3 !font-lato m-0 article-content"
            // dangerouslySetInnerHTML={{
            //   __html: item?.content,
            // }}
          >
            {item?.summary || "Empty abstract..."}
          </p>
          {item.bannerUrl && (
            <Image
              src={item.bannerUrl}
              width={96}
              height={60}
              alt="img"
              className="rounded-lg ml-2 w-auto"
            />
          )}
        </div>
        <div className="text-xs !font-lato text-[#525252] flex items-center leading-4">
          {dayjs(item?.releaseTime).format("MM-DD HH:mm")}
        </div>
      </div>
    );
  };
  return renderItem(item.status);
};

export default ListItem;
