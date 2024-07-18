import {
  ReactElement,
  Ref,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import NiceModal, { useModal, muiDialogV5 } from "@ebay/nice-modal-react";
import Dialog from "@mui/material/Dialog";
import ButtonBase from "@mui/material/ButtonBase";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import ArrowLeft from "components/icons/arrow-left.svg";
import EditIcon from "components/icons/edit.svg";
import Delete from "components/icons/delete.svg";
import Close from "components/icons/close.svg";
import Check from "components/icons/check.svg";
import { TextField } from "@mui/material";
import { createBackPack, updateBackPack, delBackPack } from "http/user";
import useNotistack from "hooks/useNotistack";
import { useTranslation } from "next-i18next";
import useUserStore from "store/useUserStore";
import { useDialog } from "components/base/Dialog";
import InfoSvg from "components/icons/redinfo.svg";
import { useDebounceFn } from "ahooks";

const SlideLeft = forwardRef(
  (
    props: TransitionProps & {
      children: ReactElement;
    },
    ref: Ref<unknown>
  ) => <Slide direction="left" ref={ref} {...props} />
);

interface Props {
  curBackpackId?: string;
}

const Index = NiceModal.create(({ curBackpackId }: Props) => {
  const { bookmarks, getBookmarks, getCollectCoins } = useUserStore();
  const modal = useModal();
  const { confirm } = useDialog();
  const { t } = useTranslation('portfolio');
  const { t: tCommon } = useTranslation('common');
  const { success, error } = useNotistack();
  const [keyword, setKeyword] = useState("");
  const [name, setName] = useState("");
  const [list, setList] = useState<API.Backpack[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { run: handleAdd } = useDebounceFn(
    async () => {
      if (!isEditing && keyword) {
        const res = await createBackPack({ name: keyword });
        if (res.success) {
          success(t("success"));
          getBookmarks();
          setKeyword("");
        }
      }
    },
    { wait: 300 }
  );

  const handleEdit = (id: string | number, name: string) => {
    const newList = list.map((item) => {
      return { ...item, isEdit: id === item.id };
    });
    setIsEditing(true);
    setName(name);
    setList(newList);
  };

  const handleDel = async (id: string | number, name: string) => {
    confirm({
      title: ``,
      content: (
        <div className="flex flex-col justify-center items-center">
          <div className="bg-accent-back border border-solid border-accent-600 rounded-full w-10 h-10 margin flex items-center justify-center">
            <InfoSvg className="text-accent-600" />
          </div>
          <div className="my-4 text-primary-900-White font-bold text-lg">
            {t("Delete")} 【{name}】
          </div>
          <div className="text-sm text-primary-900-White leading-6 text-center font-semibold mb-4">
            {t("Manage-delete")}{" "}
          </div>
          <div className="text-xs text-secondary-500-300 leading-6 text-center">
            {t("Manage-delete-desc")}{" "}
          </div>
        </div>
      ),
      async onOk() {
        const res = await delBackPack(id);
        if (res.success) {
          success(t("success"));
          setIsEditing(false);
          getBookmarks();
          getCollectCoins();
        } else {
          error(res.msg)
        }
      },
    });
  };
  const handleCancel = (id: string | number) => {
    const newList = list.map((item) => {
      return { ...item, isEdit: false };
    });
    setIsEditing(false);
    setName("");
    setList(newList);
  };

  const handleSave = async (id: string | number) => {
    if (name) {
      const res = await updateBackPack({ name, id });
      if (res.success) {
        success(t("success"));
        setIsEditing(false);
        getBookmarks();
        setName("");
      }
    }
  };

  useEffect(() => {
    setList(bookmarks);
  }, [bookmarks]);

  return (
    <Dialog fullScreen TransitionComponent={SlideLeft} {...muiDialogV5(modal)}>
      <header className="header-base text-center relative">
        <ButtonBase
          onClick={() => {
            modal.resolve();
            modal.hide();
          }}
          className="svg-icon-base text-primary-800-50 absolute left-4 top-2"
        >
          <ArrowLeft />
        </ButtonBase>
        <span className="h-9 inline-flex items-center text-primary-900-white font-bold">
          {t("Manage My Lists")}
        </span>
      </header>
      <div className="bg-dropdown-White-800 text-primary-900-White text-sm h-full p-5 flex-col justify-start items-start gap-2 flex">
        <div className="relative mb-5 flex justify-between items-center gap-8 w-full">
          <TextField
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full h-10 bg-background-primary-White-900 rounded-lg border border-solid border-primary-100-700"
            placeholder={t("Type watch list name") as string}
            disabled={isEditing}
            autoComplete="off"
            InputProps={{
              classes: {
                root: "h-full",
                notchedOutline: "border-0",
                input: "text-base py-0 h-full text-primary-900-White",
              },
            }}
          />
          {list?.length < 4 && (
            <ButtonBase
              className={`flex items-center whitespace-nowrap justify-center px-5 py-2 rounded-lg bg-brand-accent-600-600 text-sm font-medium text-white-White leading-6 ${(isEditing || !keyword) && "opacity-30"
                }`}
              onClick={handleAdd}
            >
              {t("Add")}
            </ButtonBase>
          )}
        </div>
        <div className="h-full overflow-y-auto w-full">
          {list.map((item, idx) => {
            return (
              <div key={item.id} className="flex items-center mb-5 w-full">
                {!item.isEdit ? (
                  <>
                    <div className="flex-1">
                      <div className="text-primaty-900-White text-sm leading-6 font-semibold">
                        {item?.name === "default" ? tCommon("default") : item?.name}
                      </div>
                      {item.itemCount ? (
                        <div className="text-xs text-secondary-500-300">
                          {item.itemCount} items
                        </div>
                      ) : null}
                    </div>
                    {idx > 0 && (
                      <ButtonBase
                        onClick={() => handleEdit(item.id, item.name)}
                        className="rounded-lg border border-solid border-primary-100-700 bg-background-secondary-White-700 py-2 px-4 flex items-center justify-center flex-shrink"
                      >
                        <EditIcon className=" text-primary-800-50" />
                      </ButtonBase>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <TextField
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-10 bg-background-primary-White-900 rounded-lg border border-solid border-primary-100-700"
                      placeholder={t("Type watch list name") as string}
                      inputRef={inputRef}
                      autoComplete="off"
                      InputProps={{
                        classes: {
                          root: "h-full",
                          notchedOutline: "border-0",
                          input: "text-base py-0 h-full text-primary-900-White",
                        },
                      }}
                    />
                    <ButtonBase
                      onClick={() => handleDel(item.id, item.name)}
                      className={`rounded-lg border border-solid border-primary-100-700 bg-background-secondary-White-700 py-2 px-4 flex items-center justify-center flex-shrink`}
                    >
                      <Delete className=" text-brand-accent-600-600" />
                    </ButtonBase>
                    <ButtonBase
                      onClick={() => handleCancel(item.id)}
                      className="rounded-lg border border-solid border-primary-100-700 bg-background-secondary-White-700 py-2 px-4 flex items-center justify-center flex-shrink"
                    >
                      <Close className="text-primary-800-50" />
                    </ButtonBase>
                    <ButtonBase
                      onClick={() => handleSave(item.id)}
                      className="rounded-lg border border-solid border-primary-100-700 bg-brand-accent-600-600 py-2 px-4 flex items-center justify-center flex-shrink"
                    >
                      <Check className=" text-white-white" />
                    </ButtonBase>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Dialog>
  );
});

export default Index;
