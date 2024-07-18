import React, { PropsWithChildren, useContext } from "react";
import Button from "@mui/material/Button";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import ResetPwd from "components/operation/login/ResetPwd";
import useNotistack from "hooks/useNotistack";
import { UserContext } from "store/UserStore";
import { useRouter } from 'next/router'
import Regex from "helper/regex";
type Props = PropsWithChildren<{
  handleClose: () => any;
}>;

const LoginComponent = ({ handleClose }: Props) => {
  const userStore = useContext(UserContext);
  const router = useRouter()
  const { info, error } = useNotistack();
  const [code, setCode] = React.useState(0);
  const [msg, setMsg] = React.useState("");
  const [ errorMsg, setErrorMsg ] = React.useState(false)
  const [type, setType] = React.useState(true);
  const [typeStatus, setTypeStatus] = React.useState(0);
  const [emailStatus, setEmailStatus] = React.useState(0);
  const [replyEmail, setReplyEmail] = React.useState('')
  // 0:登录，1:注册，2:忘记密码 3:邮件确认 4:重置密码提示 5:点击链接后 6:快捷登录
  const [status, setStatus] = React.useState(0);
  const [resetParams, setResetParams] = React.useState<any>();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordStatus, setPasswordStatus] = React.useState(0);
  //邮箱注册
  const openDialog = () => {
    setResetParams({
      isShow: "true",
    });
  };
  const validatePwd = (password:string) => {
    const reg = /(?=.*[a-z_])(?=.*[A-Z_])(?=.*\d)[\S]{8,20}/
    if(password.length == 0) {
      setPasswordStatus(0)
      setErrorMsg(false)
      return false
    }
    if(password.length < 8 || password.length > 20 ){
      setPasswordStatus(2)
      setMsg('The password length should be at least 8 characters and cannot exceed 20 characters.')
      return
    } 
    if(!reg.test(password)){
      setPasswordStatus(2)
      setMsg('')
      setErrorMsg(true)
      return
    } 
    
    if(reg.test(password)){
      setPasswordStatus(1)
      
    } 
    //return reg.test(password)
  }
  const loginSubmit = () => {
    const params = {
      loginName: email,
      password: btoa(password),
      type: "portal", //portal: 资讯平台，admin：管理后台
    };
    // userStore.login(params).then((res: any) => {
    //   if (res.code == 0) {
    //      handleClose()
    //     // setMsg(res.msg);
    //     // setTypeStatus(2);
    //     router.replace(router.pathname)
    //   } else if (res.code != 0) {
        
    //     error(res.msg);
    //   }
    // });
  };

  return (
    <div>
      <div className="mt-8">
        <div>
          <div className="mb-2 text-xs text-[#C2C2C2]">
            Email
          </div>
          <div className="flex item-center relative mb-4">
            <TextField
              variant="outlined"
              placeholder=""
              size="small"
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="new-email"
              onFocus={() => setCode(0)}
              onBlur={() =>{
                if(email.length == 0) {
                  setEmailStatus(0)
                  return false
                }
                if (Regex.email.test(email)) {
                  setEmailStatus(1)
                  return false
                }
                if (!Regex.email.test(email)) {
                  setEmailStatus(2)
                  return false
                }
              }}
              InputProps={{
                className:
                  "text-[#606060] h-8 leading-8 text-sm p-0 cursor-pointer",
                classes: {
                  notchedOutline: "border-1 border-[#404040]",
                  input: "hide-scrollbar",
                },
              }}
            />
            { emailStatus == 1 && <Image src='/img/svg/Success.svg' alt="" width={16} height={16} className='absolute cursor-pointer right-4 top-2'/>}
            { emailStatus == 2 && <Image src='/img/svg/Error.svg' alt="" width={16} height={16} className='absolute cursor-pointer right-4 top-2'/>}
          </div>
          { emailStatus == 2 && (
          <div className='mb-4 text-[#C2C2C2] text-xs my-1'>
            The format of the email you entered is incorrect. 
          </div>)
          }
        </div>

        <div>
          <div className="mb-2 text-xs text-[#C2C2C2] flex justify-between">
            <span>Password</span>
            <span onClick={(e) => openDialog()} className="cursor-pointer">
              Forgot password
            </span>
          </div> 
          <div className="flex item-center h-[40px] relative ">
            <TextField
              variant="outlined"
              placeholder=""
              size="small"
              fullWidth
              autoComplete="new-password"
              type={type ? "password" : "text"}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => {
                setPasswordStatus(1)
                setMsg('')
                setErrorMsg(false)
              }}
              onBlur={(e) => {
                validatePwd(e.target.value)
              }}
              InputProps={{
                className:
                  "text-[#606060] h-8 leading-8 text-sm p-0 cursor-pointer",
                classes: {
                  notchedOutline: "border-1 border-[#404040]",
                  input: "hide-scrollbar",
                },
              }}
            />

            {typeStatus == 2 && (
              <Image
                src="/img/svg/Error.svg"
                alt=""
                width={16}
                height={16}
                className="absolute cursor-pointer right-10 top-2"
              />
            )}
            <Image
              src={`${type ? "/img/svg/View.svg" : "/img/svg/EyeClose.svg"}`}
              alt=""
              width={16}
              height={16}
              className="absolute cursor-pointer right-4 top-2"
              onClick={() => setType(!type)}
            />
          </div>
          {
            errorMsg && (
              <div className='mb-4 text-[#DA1E28] text-xs'>
                  The password must contain: <br />
                  ・One uppercase letter,<br />
                  ・One lowercase letter,<br />
                  ・One number.
              </div>
            )
          }
          {msg && <div className="text-xs text-[#DA1E28]">{msg}</div>}

          <div className="h-4"></div>
        </div>

        <div>
          <Button
            disabled={!(passwordStatus == 1 && emailStatus == 1)}
            onClick={loginSubmit}
            className={`w-full h-[34px]  rounded text-sm   mx-0 normal-case ${(passwordStatus == 1 && emailStatus == 1) ?  'bg-[#C14423] text-[#C2C2C2]' : 'bg-[#141414] text-[#525252]'}`}
          >
            Log in
          </Button>
        </div>
      </div>
      <ResetPwd resetParams={resetParams} />
    </div>
  );
};

export default LoginComponent;
