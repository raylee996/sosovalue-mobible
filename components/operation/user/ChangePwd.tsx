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
import {checkOriginalPassword,checkUserNameIsRegister,logindResetPwd} from 'http/user'
import { getUrl, getUploadURL } from 'helper/config'
import { useRouter } from 'next/router'
import useNotistack from 'hooks/useNotistack'
import { UserContext } from 'store/UserStore'
import ResetPwd from 'components/operation/login/ResetPwd'
type Props = PropsWithChildren<{
  loginParams?: any,
}>

 
const ChangePwd = ({loginParams} : Props) => {
  const { success, error } = useNotistack()
  const userStore = useContext(UserContext)
  const { user } = React.useContext(UserContext)
  const router = useRouter()
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState(0);
  const [token, setToken] = React.useState();
  const [thirdpartyName, setThirdpartyName] = React.useState('rainbowkit');
  const [msg, setMsg] = React.useState('');
  const theme = useTheme();
  const [type, setType] = React.useState(true);
  const [typeAgain, setTypeAgain] = React.useState(true);
  const [typeStatus, setTypeStatus] = React.useState(0);
  // 0:登录，1:注册，2:忘记密码 3:邮件确认 4:重置密码提示 5:点击链接后 6:快捷登录
  const [status, setStatus] = React.useState(0);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { confirm } = useDialog()
  const [commentText, setCommentText] = React.useState('')
  const [id, setId] = React.useState('')
  const [currentId, setCurrentId] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [passwordAgain, setPasswordAgain] = React.useState('')
  const [passwordOriginal, setPasswordOriginal] = React.useState('')
  const [successState, setSuccessState] = React.useState<string[]>([])
  const [resetParams, setResetParams] = React.useState<any>();
  const handleClickOpen = () => {
    setOpen(true);
    
  };
  const handleClose = () => {
    setOpen(false);
  };
  
  //校验原有密码
  const checkPassword  = async () => {
    const res = await checkOriginalPassword(btoa(passwordOriginal))
    
  }
  const changePassword = async () => {
    const param = {
      //originalPassword:btoa(passwordOriginal),
      password:btoa(password),
      rePassword:btoa(passwordAgain),
    }
    const res = await logindResetPwd(param as any)
    if(res.code == 0){
      success('success')
      setOpen(false);
    } 
    if(res.code == 1) error(res.msg)
  }
  const openDialog = () => {
    setResetParams({
      isShow: "true",
    });
  };
  
  React.useEffect(() => {
    if(loginParams?.isShow){
      handleClickOpen()  
    }
}, [loginParams])
  return (
    <div>
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
            classes={{paper:'bg-[#0D0D0D] w-[500px] shadow-[0_0_8px_0_rgba(0,0,0,0.36)] rounded-lg'}}
        >
             
            <DialogContent classes={{root:'pb-6'}}>
              <div className='flex justify-center'><Image src="/img/svg/login.svg" alt="" width={153} height={32} /></div>
                  <div className='my-8'>
                    <div className='mb-1 text-[#CCCCCC] text-2xl font-bold text-center'>Change Password</div>
                  </div>
                  <div className='mt-8'>
                    {/* <div>
                      <div className='mb-2 text-xs text-[#C2C2C2] flex justify-between'>
                        <span>Original password</span> 
                        <span onClick={() => openDialog()} className="cursor-pointer">Forgot password</span> 
                      </div>
                      <div className='flex item-center h-[40px] relative '>
                          <TextField variant="outlined" placeholder='' size='small' fullWidth 
                              type={type ? 'password' : 'text'}
                              autoComplete='off'
                              onChange={e => setPasswordOriginal(e.target.value)}
                              onBlur={() => checkPassword()}
                              InputProps={{
                                  autoComplete:'new-password',
                                  className: 'text-[#606060] h-8 leading-8 text-sm p-0 cursor-pointer',
                                  classes: { notchedOutline: 'border-1 border-[#404040]', input: 'hide-scrollbar' }
                          }} />
                          <Image src={`${type ? '/img/svg/View.svg' : '/img/svg/EyeClose.svg'}`} alt="" width={16} height={16} className='absolute cursor-pointer right-4 top-2' onClick={() => setType(!type)}/>
                      </div>
                      <div className='h-4'></div>
                    </div> */}
                    <div>
                      <div className='mb-2 text-xs text-[#C2C2C2] flex justify-between'>
                        <span>{status == 5 ? 'New ' : ''}password</span> 
                      </div>
                      <div className='flex item-center h-[40px] relative '>
                          <TextField variant="outlined" placeholder='' size='small' fullWidth 
                              type={type ? 'password' : 'text'}
                              autoComplete='off'
                              onChange={e => setPassword(e.target.value)}
                              //onBlur={(e) => validatePwd(e.target.value)}
                              InputProps={{
                                  autoComplete:'new-password',
                                  className: 'text-[#606060] h-8 leading-8 text-sm p-0 cursor-pointer',
                                  classes: { notchedOutline: 'border-1 border-[#404040]', input: 'hide-scrollbar' }
                          }} />
                          {/* <Image src={`${typeStatus == 0 ? '/img/svg/Success.svg' : '/img/svg/Error.svg'}`} alt="" width={16} height={16} className='absolute cursor-pointer right-12 top-2'/> */}
                          <Image src={`${type ? '/img/svg/View.svg' : '/img/svg/EyeClose.svg'}`} alt="" width={16} height={16} className='absolute cursor-pointer right-4 top-2' onClick={() => setType(!type)}/>
                      </div>
                      {/* <div className='mb-4 text-[#DA1E28] text-xs'>
                      The password must contain: <br />
                      ・One uppercase letter,<br />
                      ・One lowercase letter,<br />
                      ・One number.
                      </div> */}
                    </div>
                    <div className='mb-4'>
                      <div className='mb-2 text-xs text-[#C2C2C2] flex justify-between'>
                        <span>{status == 5 ? 'New ' : ''}password (again)</span> 
                      </div>
                      <div className='flex item-center h-[40px] relative '>
                          <TextField variant="outlined" placeholder='' size='small' fullWidth 
                              type={typeAgain ? 'password' : 'text'}
                              autoComplete='off'
                              onChange={e => setPasswordAgain(e.target.value)}
                              InputProps={{
                                  autoComplete:'new-password',
                                  className: 'text-[#606060] h-8 leading-8 text-sm p-0 cursor-pointer',
                                  classes: { notchedOutline: 'border-1 border-[#404040]', input: 'hide-scrollbar' }
                          }} />
                          {/* <Image src={`${typeStatus == 0 ? '/img/svg/Success.svg' : '/img/svg/Error.svg'}`} alt="" width={16} height={16} className='absolute cursor-pointer right-12 top-2'/> */}
                          <Image src={`${typeAgain ? '/img/svg/View.svg' : '/img/svg/EyeClose.svg'}`} alt="" width={16} height={16} className='absolute cursor-pointer right-4 top-2' onClick={() => setTypeAgain(!typeAgain)}/>
                      </div>
                      {/* <div className='mb-4 text-[#DA1E28] text-xs'>
                      The passwords do not match.
                      </div> */} 
                    </div>
                    
                <div>
    
                  <Button onClick={changePassword} className='w-full h-[34px] bg-[#C14423] rounded text-sm text-[#C2C2C2]  mx-0 normal-case mt-4'>
                    Change password
                  </Button>

                </div>
                
              </div>
            </DialogContent>
            
            
        </Dialog>
        <ResetPwd resetParams={resetParams} />
    </div>
    )
}

export default ChangePwd