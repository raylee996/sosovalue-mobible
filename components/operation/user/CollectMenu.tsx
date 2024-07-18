import {
  Button,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
} from "@mui/material";
import useNotistack from "hooks/useNotistack";
import { useTCommon } from "hooks/useTranslation";
import { findDefaultSymbolByCurrencyIds } from "http/home";
import { createBatch, delBackPackSymbol } from "http/user";
import Star from "components/icons/star.svg";
import CheckSvg from "components/icons/check.svg";
import AddList from "components/icons/add-list.svg";
import StarFill from "components/icons/starFill.svg";
import MyListModal from "components/operation/portfolio/MyListModal";
import {
  MouseEvent,
  ReactNode,
  SyntheticEvent,
  useContext,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import { UserContext } from "store/UserStore";
import useUserStore from "store/useUserStore";
import NiceModal from "@ebay/nice-modal-react";
import { recoverExchangeName } from "helper/tools";
import { trackCollectCancel } from "helper/track";

type Props = {
  className?: string;
  label?: ReactNode;
  symbolId?: string;
  currencyId?: string;
  icon?: ReactNode;
  onCollectSuccess?:(symbolId:string,backpackId:string,)=>void
};

// const CheckAnimate = (
//   <svg width={20} height={20}>
//     <polyline
//       fill="none"
//       stroke="#FF4F20"
//       strokeWidth={2}
//       points="3,10 7,15 17,8"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeDasharray={350}
//       strokeDashoffset={350}
//       className="animate-[check-animation-tick_3s_ease-out_forwards]"
//     />
//   </svg>
// );

const CollectMenu = ({
  className,
  label,
  currencyId,
  symbolId,
  icon,
  onCollectSuccess
}: Props) => {
  const { user, authModal } = useContext(UserContext);
  const { success, error } = useNotistack();
  const { t: tCommon } = useTCommon();
  // const [animateIdMap, setAnimateIdMap] = useState<Record<string, boolean>>({});
  const [selectId, setSelectId] = useState<string>("");
  const { bookmarks, collectCoins, getCollectCoins, getBookmarks } =
    useUserStore();
  const [addEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(addEl);

  const [delEl, setDelEl] = useState<HTMLButtonElement | null>(null);
  const open2 = Boolean(delEl);

  const handleAdd = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      return authModal?.openSignupModal();
    }
    if (curPair?.id) {
      setDelEl(e.currentTarget);
    } else {
      // 收藏
      if (bookmarks.length > 1) {
        setAnchorEl(e.currentTarget);
      } else {
        collectSymbol(bookmarks?.[0]?.id);
      }
    }
  };

  const collectSymbol = async (userBackpackId: string) => {
    let id = symbolId;
    if (!id && currencyId) {
      const res = await findDefaultSymbolByCurrencyIds([currencyId], {
        skipErrorHandler: true,
      });
      if (res.success) {
        id = res.data[0].id;
      } else {
        error(res.msg);
      }
    }
    if (id) {
      await createBatch([
        { userBackpackId, symbolIdList: [id], userId: user!.id },
      ]);
      onCollectSuccess?.(id,userBackpackId);
      success(tCommon("success"));
      await getCollectCoins();
      setAnchorEl(null);

      // setAnimateIdMap({
      //   ...animateIdMap,
      //   [bookmarks.length > 1 ? userBackpackId : "0"]: true,
      // });
      // setTimeout(
      //   () =>
      //     setAnimateIdMap((animateIdMap) => ({
      //       ...animateIdMap,
      //       [bookmarks.length > 1 ? userBackpackId : "0"]: false,
      //     })),
      //   3000
      // );
    }
  };
  const handleClose = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(null);
    setDelEl(null);
  };

  const handleOpen = () => {
    NiceModal.show(MyListModal).then(() => {
      getBookmarks();
    });
  };

  const handleCancelCollect = async (item: any) => {
    // 取消收藏
    collectPair.length === 1 && setDelEl(null);
    await delBackPackSymbol([item!.symbolId], item!.userBackpackId);
    trackCollectCancel(item!.symbolId,item!.userBackpackId);
    success(tCommon("success"));
    await getCollectCoins();
  };

  // 判断是否 收藏币种id 收藏币对id
  const curPair = useMemo(
    () =>
      collectCoins.find(
        (i) => i.symbolId === symbolId || i.currencyId === currencyId
      ),
    [collectCoins, symbolId, currencyId]
  );

  const collectPair = useMemo((): any[] => {
    if (!user) {
      setDelEl(null);
      setAnchorEl(null);
      return [];
    }
    if (currencyId) {
      return collectCoins.filter((coin) => coin.currencyId === currencyId);
    } else {
      return collectCoins.filter((coin) => coin.symbolId === symbolId);
    }
  }, [collectCoins, currencyId, symbolId, user]);

  return (
    <>
      <Button
        className={`min-w-5 h-5 p-0 min-w-0 text-base ${className}`}
        onClick={handleAdd}
      >
        {/* {animateIdMap[0] ? (
          CheckAnimate
        ) : icon ||<AddIcon size={24} className=" text-primary-800-50" /> } */}
        {user && curPair?.id ? (
          <StarFill className=" text-accent-600" />
        ) : (
          icon || <Star className=" text-primary-800-50" />
        )}
        {label}
      </Button>

      <Menu
        anchorEl={addEl}
        open={open}
        onClose={handleClose}
        classes={{
          paper: `px-1 py-1 bg-dropdown-White-800 rounded-xl border border-solid border-primary-100-700`,
        }}
        TransitionProps={{ unmountOnExit: true }}
      >
        {bookmarks.map(({ id, name }) => (
          <MenuItem
            key={id}
            className="text-base text-primary-900-White h-8 flex items-center justify-between"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectId(id);
              collectSymbol(id);
            }}
          >
            {/* <span className="w-8 h-8 flex items-center justify-center">
              {animateIdMap[id] ? (
                CheckAnimate
              ) : (
                <AddIcon size={24} className=" text-primary-800-50" />
              )}
            </span> */}
            <span className="">{name === "default" ? tCommon("default") : name}</span>
            {id === selectId ? (
              <CheckSvg className="text-primary-800-50" />
            ) : null}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          className="text-base text-primary-900-White font-medium h-8"
          onClick={handleOpen}
        >
          <AddList className="text-primary-800-50" />
          Mange My Lists
        </MenuItem>
      </Menu>
      {/* 取消收藏 */}

      <Menu
        anchorEl={delEl}
        open={open2}
        onClose={handleClose}
        classes={{
          paper: `px-1 py-1 bg-dropdown-White-800 rounded-xl border border-solid border-primary-100-700`,
        }}
        TransitionProps={{ unmountOnExit: true }}
      >
        {collectPair?.length ? (
          collectPair.map((item, idx) => (
            <MenuItem
              key={item.id + idx}
              className="text-base text-primary-900-White h-10 flex items-center justify-between"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCancelCollect(item);
              }}
            >
              <StarFill className="mr-3 text-accent-600" />
              <Image
                src={
                  item?.symbolDoVO?.baseCurrencyIcon ||
                  "/img/svg/CoinVertical.svg"
                }
                width={24}
                height={24}
                alt=""
                className="rounded-[50%]"
              />
              <div className="flex flex-col ml-3">
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-primary-900-White flex items-center">
                    {item?.symbolDoVO?.baseAsset}
                    <span className="text-xs text-secondary-500-300">
                      /{item?.symbolDoVO?.quoteAsset}
                    </span>
                  </span>
                  {item?.symbolDoVO?.exchangeRate ? (
                    <span className="ml-1 text-xs text-secondary-500-300 leading-5">
                      {+item?.symbolDoVO?.exchangeRate / 10000 + "%"}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center">
                  <img
                    src={
                      item?.symbolDoVO?.exchangeIcon ||
                      "/img/svg/CoinVertical.svg"
                    }
                    className="w-4 h-4 mr-1.5 rounded-[50%]"
                  />

                  <span className="text-xs text-secondary-500-300 leading-5">
                    {recoverExchangeName(item?.symbolDoVO?.exchangeName || "")}
                  </span>
                </div>
              </div>
              <div className="text-primary-900-White text-base ml-4 w-16 flex justify-center">
                {item.userBackpackName === "default" ? tCommon("default") : item.userBackpackName}
              </div>
            </MenuItem>
          ))
        ) : (
          <MenuItem>
            <CircularProgress size={24} />
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default CollectMenu;
