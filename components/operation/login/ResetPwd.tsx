import React, { PropsWithChildren } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image'
import {changePwdForEmail} from 'http/user'
import TextField from '@mui/material/TextField';
import useNotistack from 'hooks/useNotistack'
import {getUrl,getLink} from 'helper/config'
type Props = PropsWithChildren<{
  resetParams?: any,
}>

 
const Login = ({resetParams} : Props) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [email, setEmail] = React.useState('')
  const { success,info, error } = useNotistack()
  const [type, setType] = React.useState(0);
  const handleClickOpen = () => {
      setOpen(true);
      
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  
  const emailChangePwd = async () => {
    //info(`Confirmation Email sent to ${email}.com.`)
    const param = {
      email,
      link:getLink()
    }
    const res = await changePwdForEmail(param)
    if(res.code == 0) {
      success('Email sent successfully')
      setType(1)
      handleClose()
    }else{
      error(res.msg)
    }
  }
  React.useEffect(() => {
      if(resetParams?.isShow){
        handleClickOpen()  
      }
  }, [resetParams])
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
                    <div className='mb-1 text-[#CCCCCC] text-2xl font-bold text-center'>Password Reset</div>
                    {
                      type == 0 ? (
                        <div className='text-center text-xs text-[#8F8F8F]'>
                          Forgot your password? Enter your Email address below, and we'll send you an Email allowing you to reset it.
                        </div>
                      ) : (
                        <div className='text-center text-xs text-[#8F8F8F]'>
                          We have sent you an e-mail.
                        </div>
                      )
                    }
                    
                  </div>
                  {
                    type == 0 && (
                      <>
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
                  
                      <div className='mt-8'>
                    
                        <div>
                        
                          
                          <Button onClick={emailChangePwd} className='w-full h-[34px] bg-[#C14423] rounded text-sm text-[#C2C2C2]  mx-0 normal-case mt-4'>
                            Reset password
                          </Button>
                          
                        </div>
                        
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