import { ElementType, useContext } from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { muiDrawerV5 } from "helper/niceModal";
import Drawer from "@mui/material/Drawer";
import { PaperProps } from "@mui/material/Paper";
import ButtonBase from "@mui/material/ButtonBase";
import Transfer from "components/icons/transfer.svg";
import Delete from "components/icons/delete.svg";
import { useDialog } from "components/base/Dialog";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import ToggleModal from "./ToggleModal";
import { createBatch, delBackPackSymbol, sortBackPackSymbol } from "http/user";
import { UserContext } from "store/UserStore";
import useNotistack from "hooks/useNotistack";
import TopSvg from "components/icons/top.svg";
import InfoSvg from "components/icons/redinfo.svg";
import useUserStore from "store/useUserStore";

const fullScreen: Partial<PaperProps<ElementType<any>>> = {
  sx: {
    width: "100%",
    height: "100%",
  },
};

interface Props {
  pair: any;
  pairs: Market.TradingPair[];
  curBackpackId: string;
}

const Index = NiceModal.create(({ pair, pairs, curBackpackId }: Props) => {
  const modal = useModal();
  const { user } = useContext(UserContext);
  const { t } = useTranslation(["portfolio", "common"]);
  const { confirm } = useDialog();
  const { success } = useNotistack();
  const { getCollectCoins } = useUserStore();

  const deleteCollection = () => {
    const { baseAsset, quoteAsset, id } = pair!;
    confirm({
      title: ``,
      content: (
        <div className="flex flex-col justify-center items-center">
          <div className="bg-accent-back border border-solid border-accent-600 rounded-full w-10 h-10 margin flex items-center justify-center">
            <InfoSvg className="text-accent-600" />
          </div>
          <div className="my-4 text-primary-900-White font-bold text-lg">
            {t("Delete")} {baseAsset}/{quoteAsset}
          </div>
          <div className="text-sm text-secondary-500-300 text-center">
            {t("Collection-Delete")}{" "}
          </div>
        </div>
      ),
      async onOk() {
        const res = await delBackPackSymbol([pair.id], curBackpackId);
        res.data && success(t("success"));
        getCollectCoins();
        modal.resolve("del");
        modal.hide();
      },
    });
  };

  const handleMove = () => {
    NiceModal.show(ToggleModal, { curBackpackId }).then(
      async (userBackpackId) => {
        if (userBackpackId !== curBackpackId) {
          await delBackPackSymbol([pair.id as string], curBackpackId);
          const res = await createBatch([
            {
              userBackpackId: userBackpackId as string,
              symbolIdList: [pair.id],
              userId: user?.id as string,
            },
          ]);
          res.data && success(t("success"));
          getCollectCoins();
        }
        modal.resolve("transfer");
        modal.hide();
      }
    );
  };

  const handleTop = async () => {
    const newList = [...pairs];
    const index = newList.findIndex((p) => p.id === pair.id);
    const del = newList.splice(index, 1);
    newList.unshift(del[0]);
    // const listparams = newList.map((item: any) => item.symbolId);
    const listparams = newList.map((item: any) => item.id);
    await sortBackPackSymbol(listparams, curBackpackId);
    modal.resolve("top");
    modal.hide();
  };

  return (
    <Drawer
      anchor="bottom"
      {...muiDrawerV5(modal)}
      sx={{
        ".MuiBackdrop-root": {
          backdropFilter: "blur(2px)",
        },
      }}
    >
      <div className="bg-dropdown-White-800 p-3 flex-col justify-start items-start gap-2 flex">
        <div className="flex items-center justify-between w-full px-4">
          <ButtonBase
            className="flex-1 h-10 text-primary-900-white rounded-lg justify-start gap-2 flex"
            onClick={handleTop}
          >
            <TopSvg className=" text-primary-800-50" /> {t("Top")}
          </ButtonBase>
        </div>
        <div className="flex items-center justify-between w-full px-4">
          <ButtonBase
            className="flex-1 h-10 text-primary-900-white rounded-lg justify-start gap-2 flex"
            onClick={handleMove}
          >
            <Transfer className=" text-primary-800-50" />{" "}
            {t("Move pair to", {
              pairs: pair?.baseAsset + "/" + pair?.quoteAsset,
            })}
          </ButtonBase>
        </div>
        <div className="flex items-center justify-between w-full px-4">
          <ButtonBase
            className="flex-1 h-10 text-primary-900-white rounded-lg justify-start gap-2 flex"
            onClick={deleteCollection}
          >
            <Delete className=" text-primary-800-50" /> {t("Remove")}
          </ButtonBase>
        </div>
      </div>
    </Drawer>
  );
});

export default Index;
