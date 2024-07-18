import React, { useEffect, useState } from "react";
import Image from "next/image";
import ListItem from "./ListItem";
import Link from "next/link";
import { getArticleList } from "http/activity";
import { deleteArticle } from "http/activity";
import useNotistack from "hooks/useNotistack";
type Props = {
  changeStatus: (status: number) => void;
};
const Contribute = ({ changeStatus }: Props) => {
  const [list, setList] = useState<any[]>();
  const articleList = async () => {
    const { data } = await getArticleList({
      pageNum: 1,
      pageSize: 10,
    });
    setList(data);
  };
  const { error, success } = useNotistack();
  const deleteTheArticle = async (id: string) => {
    const res = await deleteArticle(id);
    if (res.data) {
      success(res.msg);
    }
  };
  useEffect(() => {
    articleList();
  }, []);
  return (
    <div>
      <div className="px-5 py-4 ">
        <div className="flex items-center mb-6">
          <Image
            src="/img/researcherHub/Avatar.png"
            width={80}
            height={80}
            alt=""
            className="mr-6"
          />
          <div>
            <div className="text-[18px] font-bold text-[#0A0A0A] leading-7 mb-2">
              rakshamann
            </div>
            <div className="text-[12px] font-bold h-[20px] leading-5 text-center text-[#FF4F20] rounded-lg border border-solid border-[#FFEDE9] bg-[#FFF7F5]">
              S2 Participant
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div
            onClick={() => changeStatus(0)}
            className="border border-solid cursor-pointer border-[#E5E5E5] flex items-center text-base text-[#0A0A0A] rounded-lg px-5 py-2 shadow-[0_1px_2px_0_0_rgba(10,10,10,0.06)]"
          >
            <Image
              src="/img/researcherHub/Group.svg"
              width={16}
              height={16}
              className="mr-2"
              alt=""
            />
            Edit
          </div>

          <Link href="/researcher-scholarship-s2/add" className=" no-underline">
            <div className="cursor-pointer text-base font-medium bg-[#FF4F20] text-[#FFF] rounded-lg px-6 py-2 shadow-[0_1px_2px_0_rgba(10,10,10,0.06)]">
              Submit Research
            </div>
          </Link>
        </div>
      </div>
      <div className="h-[388px] overflow-y-auto">
        {list &&
          list.map((item, index) => (
            <ListItem
              key={index}
              item={item}
              // deleteTheArticle={deleteTheArticle}
            />
          ))}
      </div>
    </div>
  );
};

export default Contribute;
