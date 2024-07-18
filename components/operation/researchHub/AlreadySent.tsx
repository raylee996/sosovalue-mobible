import React, { useContext, useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import useNotistack from "hooks/useNotistack";
import { getArticleList } from "http/activity";
import { deleteArticle } from "http/activity";
import ListItem from "./ListItem";
import { useRouter } from "next/router";
type Props = {
  list: any[];
};
const AlreadySent = ({ list}: Props) => {
  const router = useRouter();


  return (
    <div className="flex-1 h-full bg-[#FFF]">
      <div className="flex h-full flex-col">
        <div className="text-[24px] text-[#0A0A0A] font-bold !font-lato">
          Researcher Hub
        </div>
        <div className="mt-8 flex-1 overflow-y-auto ">
          {list &&
            list.map((item, index) => (
              <ListItem
                key={index}
                item={item}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default AlreadySent;


