import { Avatar, ButtonBase, OutlinedInput } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "store/UserStore";
import Edit from "components/icons/edit.svg";
import CheckSvg from "components/icons/check.svg";
import { uploadFile } from "helper/request";
import { updateUsernameV3, usercenterUpdate } from "http/user";
import useNotistack from "hooks/useNotistack";
import { useGetState } from "ahooks";
import { useTCenter } from "hooks/useTranslation";
import Username from "../auth/Username";
import useUsername from "hooks/operation/useUsername";

const Profile = () => {
  const { t } = useTCenter();
  const [modify, setModify] = useState<boolean>(false);
  const { user, getUserInfo } = useContext(UserContext);
  const { error, success } = useNotistack();
  const fileInputRef = useRef<any>(null);
  const usernameField = useUsername({ validate: true, validateIsRegister: true })

  const [imgUrl, setImgUrl] = useGetState<string>(user?.photo || "");
  // const [, setUsername] = useGetState<string>(user?.username || "");
  const [bio, setBio] = useGetState<string>((user as any)?.introduction || "");
  const {value: username, setValue: setUsername} = usernameField;
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // 保存图片
  const handleSave = async () => {
    if (user) {
      let reqs = [];
      if (bio !== (user as any).introduction || imgUrl !== user.photo) {
        reqs.push(
          usercenterUpdate({ id: user?.id, introduction: bio, photo: imgUrl })
        );
      }

      if (user.editableUsername && username !== user.username) {
        reqs.push(updateUsernameV3({ username }));
      }
      try {
        const [res] = await Promise.all(reqs);
        res && success("success");
      } catch (err: any) {
        error(err?.msg);
      }
      getUserInfo();
      setModify(false);
    } else {
      setModify(false);
    }
  };

  useEffect(() => {
    if (user) {
      setImgUrl(user.photo || "");
      setUsername(user.username || "");
      setBio((user as any).introduction || "");
    }
  }, [user]);

  return (
    <>
      <div className=" text-primary-900-White text-xl font-bold mb-5">
        {t("Profile")}
      </div>
      <div className="px-5 py-4 flex flex-col justify-center items-start space-y-6 self-stretch rounded-xl border border-solid border-primary-100-700">
        <div className="flex items-center w-full">
          <Avatar
            alt="Personal"
            src={imgUrl || "/img/personal.png"}
            className="w-20 h-20"
          />
          {modify ? (
            <ButtonBase
              onClick={handleButtonClick}
              className="ml-6 bg-background-secondary-White-700 rounded-lg border border-solid border-primary-100-700 text-primary-900-White px-4 py-2"
            >
              <input
                className="hidden"
                ref={fileInputRef}
                accept="image/*"
                type="file"
                onChange={async (e) => {
                  const files = e.currentTarget.files;
                  if (files) {
                    const formData = new FormData();
                    formData.append("file", files[0]);
                    const res = await uploadFile(formData);
                    if (res.data.code === 0) {
                      setImgUrl(res.data.data.url);
                    } else {
                      error(res.data.msg);
                    }
                  }
                }}
              />
              {t("Change profile picture")}
            </ButtonBase>
          ) : (
            <div className="ml-4 text-primary-900-White text-2xl font-semibold overflow-hidden flex-1 whitespace-nowrap text-ellipsis">
              {username}
            </div>
          )}
        </div>
        {modify ? (
          <div className=" text-primary-900-White text-sm">
            <div>{t("User Name")}</div>
            {!user?.editableUsername ? (
              <div className="my-4 h-[40px] opacity-30 px-4 rounded-lg bg-background-primary-White-900 border border-solid border-primary-100-700 flex justify-between items-center">
                {username}
              </div>
            ) : (
              <Username {...usernameField} label={null} className="my-4" classes={{ label: "text-primary-900-White text-sm" }}></Username>
              // <OutlinedInput
              //   value={username}
              //   onChange={(e) => setUsername(e.target.value)}
              //   fullWidth
              //   placeholder={t("Enter Username...") as string}
              //   className={`my-4 h-[40px] rounded-lg bg-background-primary-White-900 border border-solid border-primary-100-700 outline-none flex justify-between items-center`}
              //   classes={{
              //     input: "h-full text-sm leading-6 flex-1",
              //     notchedOutline: `border`,
              //   }}
              //   sx={{
              //     ".MuiOutlinedInput-notchedOutline": {
              //       border: "none",
              //     },
              //   }}
              // />
            )}
            <div className=" text-secondary-500-300 text-xs leading-5">
              {t("Change Name Tip")}
            </div>
          </div>
        ) : null}
        {modify ? (
          <div className="w-full text-primary-900-White text-sm">
            <div className="flex items-center justify-between">
              {t("Bio")}{" "}
              <span className=" text-secondary-500-300">{bio.length}/200</span>
            </div>
            <OutlinedInput
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              fullWidth
              multiline
              rows={4}
              autoComplete="off"
              inputProps={{ maxLength: 200 }}
              placeholder={t("Enter Bio...") as string}
              className="mt-4 rounded-lg bg-background-primary-White-900 border border-solid border-primary-100-700 outline-none flex justify-between items-center"
              classes={{
                input: "h-full text-sm leading-6 flex-1",
                notchedOutline: `border`,
              }}
              sx={{
                ".MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            />
          </div>
        ) : (
          <div className="w-full text-secondary-500-300 text-sm line-clamp-3">
            {bio || ""}
          </div>
        )}
        {modify ? (
          <ButtonBase
            onClick={handleSave}
            className="py-2 px-4 flex items-center justify-center rounded-lg text-white-white border border-solid border-primary-100-700 bg-accent-600"
          >
            <CheckSvg className="w-5 h-5 text-white-white" />
            <span className="text-sm font-medium ml-2">{t("Save")}</span>
          </ButtonBase>
        ) : (
          <ButtonBase
            onClick={() => setModify(true)}
            className="py-2 px-4 flex items-center justify-center rounded-lg border border-solid border-primary-100-700 bg-background-secondary-White-700"
          >
            <Edit className="w-5 h-5 text-primary-800-50" />
            <span className="text-sm font-medium ml-2">{t("Edit")}</span>
          </ButtonBase>
        )}
      </div>
    </>
  );
};

export default Profile;
