import { FormControlLabel, Radio, Checkbox } from "@mui/material";
import { useEffect, useContext, useRef, useState } from "react";
import Drawer from "@mui/material/Drawer";
import RadioGroup from "@mui/material/RadioGroup";
import Done from "@mui/icons-material/Done";
import Image from "next/image";
import { backpackList, createBatch } from "http/user";
import { findListByBaseAsse } from "http/home";
import Button from "@mui/material/Button";
import { UserContext } from "store/UserStore";
import useNotistack from "hooks/useNotistack";
import { useTranslation } from "next-i18next";
type Props = {
  open: boolean;
  onClose: () => void;
  findList?: any;
  collectParams: any;
  currentCategray?: string;
};
const Collection = ({
  onClose,
  open,
  collectParams,
  currentCategray,
  findList,
}: Props) => {
  const { user } = useContext(UserContext);
  const { success } = useNotistack();
  const [symbol, setSymbol] = useState<API.TradingPair[]>();
  const [list, setList] = useState<API.Backpack[]>();
  const [symbolIdList, setSymbolIdList] = useState<string[]>([]);
  const [userBackpackIdList, setUserBackpackIdList] = useState<string[]>([]);
  const { t } = useTranslation(["home"]);
  const getSymbol = async () => {
    if (collectParams.page == "coin") {
      const { data } = await findListByBaseAsse(collectParams?.coin);
      setSymbol(data);
      const id = data[0]?.id as string;
      setSymbolIdList([id]);
    } else {
      setSymbol([]);
      setSymbolIdList([collectParams.symbolId]);
    }
  };
  const getBackpack = async () => {
    const { data } = await backpackList({});
    const id = data[0]?.id as string;
    //setSymbolIdList([id]);
    setList(data);
    setUserBackpackIdList([id]);
  };
  const handleTransfer = async (
    symbolIdList: string[],
    userBackpackIdList: string[]
  ) => {
    let createParams: any = [];
    userBackpackIdList.map((item) => {
      createParams.push({
        userBackpackId: item,
        symbolIdList: symbolIdList,
        useId: user?.id,
      });
    });
    const res = await createBatch(createParams);
    if (res.data) {
      success(t("success"));
    }
  };

  const handleCommit = () => {
    handleTransfer(symbolIdList, userBackpackIdList);
    onClose();
  };

  useEffect(() => {
    if (open) {
      getSymbol();
      getBackpack();
    }
  }, [open]);
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      classes={{
        paper: "bg-[#1A1A1A] rounded-t-xl max-h-[70vh] overflow-y-auto",
      }}
    >
      <div className="pb-8">
        {symbol && (
          <>
            <div className=" h-[52px] leading-[52px] px-4 ">
              <span className="text-[#D6D6D6] text-sm normal-case">
                {t("Select pairs to portfolio")}
              </span>
            </div>
            <div>
              <RadioGroup
                value={currentCategray}
                row
                name="row-radio-buttons-group"
                classes={{
                  root: "text-[#C2C2C2] text-sm grid grid-cols-1",
                }}
              >
                {symbol.map((item: any, index: number) => {
                  return (
                    <div
                      key={item.id}
                      className={`flex p-2 ${
                        symbolIdList.indexOf(item.id) !== -1
                          ? "bg-[#6A6A6A]/[.16]"
                          : "bg-[#0A0A0A]"
                      }`}
                    >
                      <FormControlLabel
                        value={item.id}
                        control={
                          index === 0 ? (
                            <Checkbox
                              checked={symbolIdList.indexOf(item.id) !== -1}
                              checkedIcon={
                                <Image
                                  src="/img/svg/home/CheckCircle_active.svg"
                                  width={24}
                                  height={24}
                                  alt=""
                                />
                              }
                              icon={
                                <Image
                                  src="/img/svg/home/CheckCircle.svg"
                                  width={24}
                                  height={24}
                                  alt=""
                                />
                              }
                              classes={{
                                root: `text-[#C2C2C2]`,
                                checked: "text-[#FF4F20]",
                              }}
                            />
                          ) : (
                            <Checkbox
                              checkedIcon={
                                <Image
                                  src="/img/svg/home/CheckCircle_active.svg"
                                  width={24}
                                  height={24}
                                  alt=""
                                />
                              }
                              icon={
                                <Image
                                  src="/img/svg/home/CheckCircle.svg"
                                  width={24}
                                  height={24}
                                  alt=""
                                />
                              }
                              classes={{
                                root: `text-[#C2C2C2]`,
                                checked: "text-[#FF4F20]",
                              }}
                            />
                          )
                        }
                        label={
                          <div className="flex items-center w-full">
                            <div className="text-left flex items-center">
                              <Image
                                src={collectParams.coinImg}
                                width={24}
                                height={24}
                                alt=""
                              />
                              <div className="ml-3">
                                <div className="text-base text-[#F2F2F2]">
                                  {item.baseAsset}/{item.quoteAsset}
                                </div>
                                <div className="text-xs text-[#BFBFBF]">
                                  {item.exchangeName}
                                </div>
                              </div>
                            </div>
                          </div>
                        }
                        labelPlacement="start"
                        classes={{
                          root: "rounded m-0 p-1 pl-[7px] w-full text-center",
                          label: "text-base w-full",
                        }}
                        onChange={(e: any) => {
                          let symbolList = [...symbolIdList];

                          if (symbolList.indexOf(item.id) === -1) {
                            setSymbolIdList([...symbolIdList, item.id]);
                          } else {
                            symbolList.splice(symbolList.indexOf(item.id), 1);

                            //console.log(item.id);
                            setSymbolIdList([...symbolList]);
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
            <div className="h-[1px] bg-[#333333] mt-4"></div>
          </>
        )}
        {}
        <div className=" h-[52px] leading-[52px] px-4 ">
          <span className="text-[#D6D6D6] text-sm normal-case">
            {t("Your portfolio")}
          </span>
        </div>
        <div>
          <RadioGroup
            value={currentCategray}
            row
            name="row-radio-buttons-group"
            classes={{
              root: "text-[#C2C2C2] text-sm grid grid-cols-1",
            }}
          >
            {list &&
              list.map((item: any, index: number) => {
                return (
                  <div
                    key={item.id}
                    className={`flex p-2 ${
                      userBackpackIdList.indexOf(item.id) !== -1
                        ? "bg-[#6A6A6A]/[.16]"
                        : ""
                    }`}
                  >
                    <FormControlLabel
                      value={item.name}
                      control={
                        index === 0 ? (
                          <Checkbox
                            checked={userBackpackIdList.indexOf(item.id) !== -1}
                            checkedIcon={
                              <Image
                                src="/img/svg/home/CheckCircle_active.svg"
                                width={24}
                                height={24}
                                alt=""
                              />
                            }
                            icon={
                              <Image
                                src="/img/svg/home/CheckCircle.svg"
                                width={24}
                                height={24}
                                alt=""
                              />
                            }
                            classes={{
                              root: `text-[#C2C2C2]`,
                              checked: "text-[#FF4F20]",
                            }}
                          />
                        ) : (
                          <Checkbox
                            checkedIcon={
                              <Image
                                src="/img/svg/home/CheckCircle_active.svg"
                                width={24}
                                height={24}
                                alt=""
                              />
                            }
                            icon={
                              <Image
                                src="/img/svg/home/CheckCircle.svg"
                                width={24}
                                height={24}
                                alt=""
                              />
                            }
                            classes={{
                              root: `text-[#C2C2C2]`,
                              checked: "text-[#FF4F20]",
                            }}
                          />
                        )
                      }
                      label={
                        <div className="text-[#F2F2F2] text-base font-bold text-left w-full">
                          {item.name}
                        </div>
                      }
                      labelPlacement="start"
                      classes={{
                        root: "rounded m-0 p-1 pl-[7px] w-full text-center",
                        label: "text-base w-full",
                      }}
                      onChange={(e: any) => {
                        let userBackpackList = [...userBackpackIdList];
                        if (userBackpackList.indexOf(item.id) === -1) {
                          setUserBackpackIdList([
                            ...userBackpackIdList,
                            item.id,
                          ]);
                        } else {
                          userBackpackList.splice(
                            userBackpackList.indexOf(item.id),
                            1
                          );
                          setUserBackpackIdList([...userBackpackList]);
                        }
                      }}
                    />
                  </div>
                );
              })}
          </RadioGroup>
        </div>
        <div className="mx-4">
          <Button
            onClick={handleCommit}
            className="w-full h-[44px] bg-[#FF4F20] rounded text-sm font-bold text-[#F5F5F5] normal-case"
          >
            {t("Confirm")}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default Collection;
