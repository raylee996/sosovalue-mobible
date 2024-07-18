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
import {bindForEmail} from 'http/user'
import { getUrl, getUploadURL } from 'helper/config'
import { useRouter } from 'next/router'
import useNotistack from 'hooks/useNotistack'
import { UserContext } from 'store/UserStore'
import { useGoogleLogin } from '@react-oauth/google';
import { getLink } from 'helper/config'
type Props = PropsWithChildren<{
  bindEmailParams?: any,
  
}>

 
const BindEmail = ({bindEmailParams} : Props) => {
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
  const handleClickOpen = () => {
      setOpen(true);
      
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  //邮箱注册
  
  const link = async () => {
    const res = await bindForEmail({email: email,link:`${getLink()}/center`})
    if(res.code == 0){
      success('Confirmation Email sent to ' + email)
      setOpen(false);
    }  
    if(res.code != 0) error(res.msg)
  }
  
  React.useEffect(() => {
      if(router.query.token && router.query.type){
      

        if(router.query.type == 'EMAILREGISTER') setStatus(3)
        if(router.query.type == 'FORGOTPASSWORD') setStatus(5)
      }

      if(bindEmailParams?.isShow){
        handleClickOpen()  
      }
  }, [bindEmailParams])
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
                <div className='mb-1 text-[#CCCCCC] text-2xl font-bold text-center'>Confirm E-mail Address</div>
                <div className='text-center text-xs text-[#8F8F8F] mt-8'>
                  Please confirm that {email} is your email address.
                </div>
              </div>
              
              <div className='mt-8'>
              
                
                <div>
                  <div className='mb-2 text-xs text-[#C2C2C2]'>Email</div>
                  <div className='flex item-center relative mb-4'>
                      <TextField variant="outlined" placeholder='' size='small' fullWidth
                          onChange={e => setEmail(e.target.value)}
                          autoComplete='off'
                          InputProps={{
                              className: 'text-[#606060] h-8 leading-8 text-sm p-0 cursor-pointer',
                              classes: { notchedOutline: 'border-1 border-[#404040]', input: 'hide-scrollbar' }
                      }} />
                  </div>
                  
                </div>
                <div>
                  
                   <Button onClick={link} className='w-full h-[34px] bg-[#C14423] rounded text-sm text-[#C2C2C2]  mx-0 normal-case'>
                    Confirm
                  </Button>
                </div>
              </div>
            </DialogContent>
            
            
        </Dialog>
    </div>
    )
}

export default BindEmail