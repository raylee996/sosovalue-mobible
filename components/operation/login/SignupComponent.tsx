import React from 'react'
import Button from '@mui/material/Button';
import Image from 'next/image'
import TextField from '@mui/material/TextField';
import {registerForEmail} from 'http/user'
import useNotistack from 'hooks/useNotistack'
import ResetPwd from 'components/operation/login/ResetPwd'
import { getLink } from 'helper/config'
const SignupComponent = () => {
  const [code, setCode] = React.useState(0);
  const [msg, setMsg] = React.useState('');
  const [typeStatus, setTypeStatus] = React.useState(0);
  // 0:登录，1:注册，2:忘记密码 3:邮件确认 4:重置密码提示 5:点击链接后 6:快捷登录
  const [status, setStatus] = React.useState(0);
  const { success, error } = useNotistack()
  const [email, setEmail] = React.useState('')
  const [forgetParams, setForgetParams] = React.useState<any>()
  const [resetParams, setResetParams] = React.useState<any>();
  
  //邮箱注册
  const emailRegister = async () => {
    const param = {
      email,
      link:getLink()
    }
    const res = await registerForEmail(param)
    if(res.code == 0){
      success(`Confirmation Email sent to ${email}`)
      setStatus(1)
    }else if(res.code == 40032){
      setCode(1)
    }else{
      error(res.msg)
    }
   
  }

  const openDialog = () => {
    setResetParams({
      isShow: "true",
    });
  };
  const validatePwd = (password:string) => {
    const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,10}/
    console.log(reg.test(password))
    //return reg.test(password)
  }
  
 
  return (
    <div>
      <div className='mt-8'>
          <div className='mb-2 text-xs text-[#C2C2C2]'>Email</div>
          <div className='flex item-center relative mb-4'>
              <TextField variant="outlined" placeholder='' size='small' fullWidth
                  onChange={e => setEmail(e.target.value)}
                  autoComplete='off'
                  onFocus={() => {
                    setStatus(0)
                    setCode(0)
                  }}
                  InputProps={{
                      className: 'text-[#606060] h-8 leading-8 text-sm p-0 cursor-pointer',
                      classes: { notchedOutline: 'border-1 border-[#404040]', input: 'hide-scrollbar' }
              }} />
              { typeStatus == 1 && <Image src='/img/svg/Success.svg' alt="" width={16} height={16} className='absolute cursor-pointer right-4 top-2'/>}
              { typeStatus == 2 && <Image src='/img/svg/Error.svg' alt="" width={16} height={16} className='absolute cursor-pointer right-4 top-2'/>}
          </div>
          {
            (code == 1) && (
              <div className='mb-4 text-[#C2C2C2] text-xs my-1'>
                Your email has been registered, which means you cannot use this email to create a new account. If you have forgotten your password, you can click the link below to reset it.<br/>
                <span onClick={() => openDialog()} className='text-[#226DFF] underline underline-offset-1 cursor-pointer'>Forgot password</span>
              </div>
            )
          }
        </div>
        <div>
          <Button disabled ={ status == 1} onClick={emailRegister} className={`w-full h-[34px] bg-[#C14423] rounded text-sm text-[#C2C2C2]  mx-0 normal-case ${status == 1 ? 'opacity-20': ''}` }>
            Sign Up
          </Button>
        </div> 
        <ResetPwd resetParams={resetParams} />
    </div>
    )
}

export default SignupComponent