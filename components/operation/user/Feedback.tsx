import React, { PropsWithChildren, useState } from 'react'
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
import { createFeedback } from "http/user"
import useNotistack from "hooks/useNotistack";
import Regex from "helper/regex";
import { UserContext } from 'store/UserStore';
type Props = PropsWithChildren<{
  feedbackParams?: any,
  
}>

 
const Feedback = ({feedbackParams} : Props) => {
    const [open, setOpen] = React.useState(false);
    const userStore = React.useContext(UserContext)
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const { success, error } = useNotistack()
    const [type, setType] = useState(-1)
    const [replyEmail, setReplyEmail] = useState('')
    const [description, setDescription] = useState('')
    const [typeStatus, setTypeStatus] = React.useState(0);
    const create = () => {
      if (type === -1) {
        return error('please feedback category')
    }
        createFeedback({type, replyEmail, description}).then(res => {
            setType(-1)
            setTypeStatus(0)
            setReplyEmail('')
            setDescription('')
            setOpen(false);
            userStore.setUserTask()
            success('submit successfully')
        })
    }
    const handleClickOpen = () => {
        setOpen(true);
        
    };
    
    const handleClose = () => {
        setOpen(false);
    };
    React.useEffect(() => {
        if(feedbackParams?.isShow){
            handleClickOpen()
        }
    }, [feedbackParams])
    return (
    <div>
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
            classes={{paper:'bg-[#141414] w-[475px] shadow-[0_36px_100px_0_rgba(0,0,0,0.7),0_1px_1px_0_[0,0,0,1]] '}}
        >
            
            <DialogContent classes={{root:'pb-6'}}>
              <div className='text-xl text-[#C2C2C2] font-bold text-center relative mb-8'>
                Feedback
                <Image src="/img/svg/X.svg" alt="" width={24} height={24} className='absolute right-0 cursor-pointer' onClick={handleClose}/>
              </div>
              <div className='mb-8'>
                <div className='text-xs text-[#C2C2C2] mb-2'>Feedback category</div>
                <div className='grid grid-cols-3 gap-4'>
                  <div onClick={() => setType(1)} className={`${type === 1 ? 'bg-primary' : 'bg-[rgba(106,106,106,0.16)]'} py-6 text-center text-[#C2C2C2] text-base bg-[#6A6A6A]/[.16] rounded`} >
                  <Image src="/img/svg/BugBeetle.svg" alt="" width={32} height={32} className='block mx-auto mb-2'/>
                  Problem
                  </div>
                  <div onClick={() => setType(2)} className={`${type === 2 ? 'bg-primary' : 'bg-[rgba(106,106,106,0.16)]'} py-6 text-center text-[#C2C2C2] text-base bg-[#6A6A6A]/[.16] rounded`} >
                  <Image src="/img/svg/Lightbulb.svg" alt="" width={32} height={32} className='block mx-auto mb-2'/>
                  Suggestion
                  </div>
                  <div onClick={() => setType(3)} className={`${type === 3 ? 'bg-primary' : 'bg-[rgba(106,106,106,0.16)]'} py-6 text-center text-[#C2C2C2] text-base bg-[#6A6A6A]/[.16] rounded`} >
                  <Image src="/img/svg/Question.svg" alt="" width={32} height={32} className='block mx-auto mb-2'/>
                  Question
                  </div>
                </div>
              </div>
              <div className='mb-8'>
                  <div className='mb-2 text-xs text-[#C2C2C2]'>Email</div>
                  <div className='flex item-center relative'>
                      <TextField variant="outlined" placeholder='' size='small' fullWidth
                          onChange={e => setReplyEmail(e.target.value)}
                          autoComplete='off'
                          onBlur={() =>{
                            if(replyEmail.length == 0) {
                              setTypeStatus(0)
                              return false
                            }
                            if (Regex.email.test(replyEmail)) {
                              setTypeStatus(1)
                              return false
                            }
                            if (!Regex.email.test(replyEmail)) {
                              setTypeStatus(2)
                              return false
                            }
                          }}
                          InputProps={{
                              autoComplete:'new-password',
                              className: 'text-[#606060] h-8 leading-8 text-sm p-0 cursor-pointer',
                              classes: { notchedOutline: 'border-1 border-[#404040]', input: 'hide-scrollbar' }
                      }} />
                      { typeStatus == 1 && <Image src='/img/svg/Success.svg' alt="" width={16} height={16} className='absolute cursor-pointer right-4 top-2'/>}
                      { typeStatus == 2 && <Image src='/img/svg/Error.svg' alt="" width={16} height={16} className='absolute cursor-pointer right-4 top-2'/>}
                  </div>
                </div>
                <div className='mb-8'>
                  <div className='mb-2 text-xs text-[#C2C2C2]'>Description</div>
                  <div className='flex relative'>
                      <TextField variant="outlined" placeholder='' size='small' fullWidth
                          onChange={e => setDescription(e.target.value)}
                          multiline
                          autoComplete='off'
                          rows={10}
                          InputProps={{
                              className: 'text-[#606060] bg-[#262626]  w-full h-[217px] text-sm p-0',
                              classes: { notchedOutline: 'border-0 border-b border-[#6F6F6F] border-solid', input: 'hide-scrollbar border-0  w-full p-2 h-[200px]' },
                              
                      }} />
                  </div>
                </div>
                <div className='flex justify-center'>
                  <Button onClick={create} className='w-[75px] h-[34px] bg-[#C14423] rounded text-sm text-[#C2C2C2]  mx-0 normal-case'>
                    Submit
                  </Button>
                </div>
            </DialogContent>
            
            
        </Dialog>
    </div>
    )
}

export default Feedback