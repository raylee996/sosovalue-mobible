import React, { PropsWithChildren, useContext } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useDialog } from 'components/base/Dialog'
import Image from 'next/image'
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import {registerForEmail,userRegister,checkUserNameIsRegister,thirdPartyLogin, changePwdForEmail,resetPassword} from 'http/user'
import { getUrl, getUploadURL } from 'helper/config'
import { useRouter } from 'next/router'
import useNotistack from 'hooks/useNotistack'
import { UserContext } from 'store/UserStore'
import { useDebounce, useUpdateEffect } from 'ahooks';
import { setToken } from 'helper/storage';


type Props = PropsWithChildren<{
  confirmParams?: any,
  handleClose:() => void
}>

 
const Login = ({confirmParams, handleClose} : Props) => {
  const { success, error } = useNotistack()
  const userStore = useContext(UserContext)
  const router = useRouter()
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState(0);
  //const [token, setToken] = React.useState();
  const [thirdpartyName, setThirdpartyName] = React.useState('rainbowkit');
  const [msg, setMsg] = React.useState('');
  const theme = useTheme();
  const [type, setType] = React.useState(true);
  const [typeAgain, setTypeAgain] = React.useState(true);
  const [typeStatus, setTypeStatus] = React.useState(0);
  const [userStatus, setUserStatus] = React.useState(0);
  const [passwordStatus, setPasswordStatus] = React.useState(0);
  const [rePasswordStatus, setRePasswordStatus] = React.useState(0);
  // 0:登录，1:注册，2:忘记密码 3:邮件确认 4:重置密码提示 5:点击链接后 6:快捷登录
  const [status, setStatus] = React.useState(1);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { confirm } = useDialog()
  const [commentText, setCommentText] = React.useState('')
  const [id, setId] = React.useState('')
  const [currentId, setCurrentId] = React.useState('')
  const [email, setEmail] = React.useState<any>('')
  const [password, setPassword] = React.useState('')
  const [username, setUsername] = React.useState('')
  const debouncedUsername = useDebounce(username, { wait: 500 });
  const [passwordAgain, setPasswordAgain] = React.useState('')
  const [successState, setSuccessState] = React.useState<string[]>([])
  const [errorState, setErrorState] = React.useState<string[]>([])
  const [userNameStatus, setUserNameStatus] = React.useState(0)
  const [ errorMsg, setErrorMsg ] = React.useState(false)
  const [msgAgain,setMsgAgian] = React.useState('')
  const handleClickOpen = () => {
      setOpen(true);
  };
  
  const handleCloseDialog = () => {
    setOpen(false);
  };
  
  
  
  
  const thirdRegister  = async () => {
    
    const param = {
      thirdpartyName:thirdpartyName,
      password:btoa(password),
      rePassword:btoa(passwordAgain),
      username,
      token:router.query.token
    }
    // userStore.thirdRegister(param)
    // const res = await userRegister(param)
    
  }

  const registerTheEmail = async () => {
    const param = {
      thirdpartyName:thirdpartyName,
      password:btoa(password),
      rePassword:btoa(passwordAgain),
      username,
      token:router.query.token
    }
    
    const res = await userRegister(param)
    if (res.code == 0) {
        handleCloseDialog()
        handleClose()
        setToken(res.data.token)
        userStore.getUserInfo()
        window.location.href = "/"
    }
    if (res.code == 1) error(res.msg)
    //userStore.register(param)

  }
  
  const checkUserName = async (username:string) => {
    if(username.length == 0){
      setUserStatus(0)
      return false
    }
    const reg = /^[a-zA-Z0-9_-]{3,15}$/
    if(!reg.test(username)){
      error(
        `Must be at least 3 characters and cannot exceed 15 characters.
        Only contain letters, numbers, underscores.
        Cannot be duplicated with other users.`
      )
      setUserStatus(2)
      return false
    }
    const param = {
      username:username
    }
    const res = await checkUserNameIsRegister(username)
    
    if(res.code == 0){
      setUserStatus(1)
    } 
    if(res.code == 1) {
      setUserStatus(2)
      error(res.msg)
    }
  }
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
  const validatePwdAgain = (passwordAgain:string) => {
    if(passwordAgain.length == 0) {
      setPasswordStatus(0)
      return false
    }
    if(password != passwordAgain){
      setRePasswordStatus(2)
      setMsgAgian('The passwords do not match.')
      return
    } else{
      setRePasswordStatus(1)
    }
    
  }
  useUpdateEffect(() => {
    checkUserName(debouncedUsername)
}, [debouncedUsername])
  React.useEffect(() => {
      
      if(confirmParams?.isShow && router.query.email && router.query.token && router.query.type == 'EMAILREGISTER'){
        const emails = router.query.email || ''
        setEmail(emails)
        handleClickOpen()  
      }
  }, [confirmParams,router.query.email])
  return (
    <div>
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleCloseDialog}
            aria-labelledby="responsive-dialog-title"
            classes={{paper:'bg-[#0D0D0D] w-[500px] shadow-[0_0_8px_0_rgba(0,0,0,0.36)] rounded-lg'}}
        >
            
            <DialogContent classes={{root:'pb-6'}}>
              <div className='flex justify-center'><Image src="/img/svg/login.svg" alt="" width={153} height={32} /></div>
                {
                  status == 1 && (
                    <div className='flex items-center mt-8 text-[#8F8F8F] text-xl justify-center'>
                      {/* <div className={`mx-8 cursor-pointer`}>Log In</div> */}
                      <div className={`mx-8 cursor-pointer text-[#FF4F20] font-bold`} >Sign Up</div>
                    </div>  
                  )
                }
                {
                  status == 0 && (
                    <>
                    <div className='my-8'>
                      <div className='mb-1 text-[#CCCCCC] text-2xl font-bold text-center'>Confirm E-mail Address</div>
                      <div className='text-center text-xs text-[#8F8F8F] mt-8'>
                        Please confirm that {email} is your email address.
                      </div>
                    </div>
                
                    <div>
                    <Button onClick={() => setStatus(1)} className='w-full h-[34px] bg-[#C14423] rounded text-sm text-[#C2C2C2]  mx-0 normal-case'>
                      Confirm
                    </Button>
                    </div>
                    </>
                  )
                }
              
              {
                status == 1 && (
              <>
              <div className='mt-8'>
                <div className='mb-2 text-xs text-[#C2C2C2]'>Username</div>
                <div className='flex item-center relative'>
                    <TextField variant="outlined" placeholder='' size='small' fullWidth
                        onChange={e => setUsername(e.target.value)}
                        autoComplete='off'
                        InputProps={{
                            autoComplete:'new-password',
                            className: 'text-[#606060] h-8 leading-8 text-sm p-0 cursor-pointer',
                            classes: { notchedOutline: 'border-1 border-[#404040]', input: 'hide-scrollbar' }
                    }} />
                    { userStatus == 1 && <Image src='/img/svg/Success.svg' alt="" width={16} height={16} className='absolute cursor-pointer right-4 top-2'/>}
                    { userStatus == 2 && <Image src='/img/svg/Error.svg' alt="" width={16} height={16} className='absolute cursor-pointer right-4 top-2'/>}
                </div>
                <div className='mb-4 text-[#C2C2C2] text-xs my-1'>
                  After username registration, it can only be modified once.
                </div>
                <div className='mb-2 text-xs text-[#C2C2C2] flex justify-between'>
                  <span>password</span> 
                </div>
                <div className={`flex item-center h-[40px] relative ${userStatus == 0 ? 'opacity-20' : ''}`}>
                    <TextField variant="outlined" placeholder='' size='small' fullWidth 
                        type={type ? 'password' : 'text'}
                        autoComplete='off'
                        disabled = {userStatus == 0}
                        onChange={e => setPassword(e.target.value)}
                        onBlur={(e) => {
                          validatePwd(e.target.value)
                          validatePwdAgain(passwordAgain)
                        }}
                        onFocus={() => {
                          setMsg('')
                          setErrorMsg(false)
                          setMsgAgian('')
                          setPasswordStatus(0)
                          validatePwd(password)
                          validatePwdAgain(passwordAgain)
                        }}
                        InputProps={{
                            autoComplete:'new-password',
                            className: 'text-[#606060] h-8 leading-8 text-sm p-0 cursor-pointer',
                            classes: { notchedOutline: 'border-1 border-[#404040]', input: 'hide-scrollbar' }
                    }} />
                    { passwordStatus == 1 && <Image src='/img/svg/Success.svg' alt="" width={16} height={16} className='absolute cursor-pointer right-10 top-2'/>}
                    { passwordStatus == 2 && <Image src='/img/svg/Error.svg' alt="" width={16} height={16} className='absolute cursor-pointer right-10 top-2'/>}
                    <Image src={`${type ? '/img/svg/View.svg' : '/img/svg/EyeClose.svg'}`} alt="" width={16} height={16} className='absolute cursor-pointer right-4 top-2' onClick={() => setType(!type)}/>
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
                <div className='mb-4 text-[#DA1E28] text-xs'>
                    {msg}
                </div>
              </div>
              <div className='mb-4'>
                <div className='mb-2 text-xs text-[#C2C2C2] flex justify-between'>
                  <span>password (again)</span> 
                </div>
                <div className={`flex item-center h-[40px] relative ${userStatus == 0 ? 'opacity-20' : ''}`}>
                    <TextField variant="outlined" placeholder='' size='small' fullWidth 
                        type={typeAgain ? 'password' : 'text'}
                        autoComplete='off'
                        disabled = {userStatus == 0}
                        onChange={e => setPasswordAgain(e.target.value)}
                        onBlur={(e) => {
                          validatePwd(password)
                          validatePwdAgain(e.target.value)
                        }}
                        onFocus={() => {
                          setMsg('')
                          setErrorMsg(false)
                          setMsgAgian('')
                          setRePasswordStatus(0)
                          validatePwd(password)
                          validatePwdAgain(passwordAgain)
                        }}
                        InputProps={{
                            autoComplete:'new-password',
                            className: 'text-[#606060] h-8 leading-8 text-sm p-0 cursor-pointer',
                            classes: { notchedOutline: 'border-1 border-[#404040]', input: 'hide-scrollbar' }
                    }} />
                    { rePasswordStatus == 1 && <Image src='/img/svg/Success.svg' alt="" width={16} height={16} className='absolute cursor-pointer right-10 top-2'/>}
                    { rePasswordStatus == 2 && <Image src='/img/svg/Error.svg' alt="" width={16} height={16} className='absolute cursor-pointer right-10 top-2'/>}
                    <Image src={`${typeAgain ? '/img/svg/View.svg' : '/img/svg/EyeClose.svg'}`} alt="" width={16} height={16} className='absolute cursor-pointer right-4 top-2' onClick={() => setTypeAgain(!typeAgain)}/>
                </div>
                <div className='mb-4 text-[#DA1E28] text-xs'>
                  {msgAgain}
                </div>
                <div className='mt-4'>
                  <Button disabled={ !(rePasswordStatus == 1 && passwordStatus == 1 && userStatus == 1)} onClick={registerTheEmail} className={`w-full h-[34px]  rounded text-sm  mx-0 normal-case ${(rePasswordStatus == 1 && passwordStatus == 1 && userStatus == 1) ?  'bg-[#C14423] text-[#C2C2C2]' : 'bg-[#141414] text-[#525252]'}`}>
                    Confirm
                  </Button>
                </div>
                <div className='mt-8 text-xs text-[#808080] text-center font-normal whitespace-nowrap'>By signing up,you agree to our <Link href='https://sosovalue.xyz/blog/terms-of-service' target='_blank'>Terms</Link> and <Link href='https://sosovalue.xyz/blog/privacy-policy' target='_blank'>Privacy Policy</Link></div>
                </div>
                </>
                )
              } 
              
            </DialogContent>
            
            
        </Dialog>
    </div>
    )
}

export default Login