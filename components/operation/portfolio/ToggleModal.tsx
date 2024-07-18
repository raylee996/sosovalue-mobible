import { ElementType, useEffect, useState } from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { muiDrawerV5 } from "helper/niceModal";
import Drawer from "@mui/material/Drawer";
import { PaperProps } from "@mui/material/Paper";
import ButtonBase from "@mui/material/ButtonBase";
import CheckSvg from "components/icons/check.svg";
import useUserStore from "store/useUserStore";

const fullScreen: Partial<PaperProps<ElementType<any>>> = {
  sx: {
    width: "100%",
    height: "100%",
  },
};

interface Props {
  curBackpackId: string | number;
}

const Index = NiceModal.create(({ curBackpackId }: Props) => {
  const modal = useModal();
  const { bookmarks } = useUserStore();
  const [list, setList] = useState<API.Backpack[]>([]);

  const handleClick = (id: string | number) => {
    modal.resolve(id);
    modal.hide();
  };

  useEffect(() => {
    setList(bookmarks);
  }, [bookmarks]);
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
        {list.map((x) => (
          <div
            key={x.id}
            className="flex items-center justify-between w-full px-4"
          >
            <ButtonBase
              onClick={() => handleClick(x.id)}
              className="flex-1 h-10 text-primary-900-white rounded-lg justify-start gap-2 flex"
            >
              {x.name}
            </ButtonBase>
            {curBackpackId === x.id ? (
              <CheckSvg className=" text-primary-800-50" />
            ) : null}
          </div>
        ))}
      </div>
    </Drawer>
  );
});

export default Index;
