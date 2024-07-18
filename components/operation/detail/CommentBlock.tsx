import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import useNotistack from 'hooks/useNotistack';
import { UserContext } from 'store/UserStore';
import { createComment, like, unlike } from 'http/detail';
import dayjs from 'dayjs';
import Image from 'next/image';
import IconButton from '@mui/material/IconButton';
import { formatDate } from 'helper/tools';

type Props = {
    commentList: API.Comment[];
    refreshComments: () => void;
    currencySymbolInfo?: API.CurrencySymbolInfo;
}
const CommentBlock = ({ commentList, refreshComments, currencySymbolInfo }: Props) => {
    const { error, success } = useNotistack()
    const { user } = React.useContext(UserContext)
    const [commentText, setCommentText] = React.useState('')
    const addComment = async () => {
        if (!user) {
            return error('Please log in first')
        }
        if (commentText.length > 350) {
            return error('The value contains a maximum of 350 characters')
        }
        if (!commentText) {
            return
        }
        await createComment({
            commentAuthor: user.username,
            commentAuthorId: user.id,
            commentAuthorImg: user.photo || '',
            commentCreatedAt: dayjs().valueOf(),
            commentName: user.username,
            commentText, commentType: 5,
            topicId: currencySymbolInfo?.currencyId
        })
        refreshComments()
        success('Review success')
        setCommentText('')
    }
    const likeComment = async (id: number) => {
        if (!user) {
            return error('Please log in first')
        }
        await like(id, user.id)
        refreshComments()
    }
    const unlikeComment = async (id: number) => {
        if (!user) {
            return error('Please log in first')
        }
        await unlike(id, user.id)
        refreshComments()
    }
    return (
        <div>
            <div className='relative bg-[#1E1E1E] mb-0.5'>
                <TextField variant="outlined" placeholder='Say Something' size='small' fullWidth
                    value={commentText} onChange={e => setCommentText(e.target.value)}
                    InputProps={{
                        className: 'text-[#A0A0A0] leading-5 pr-[100px]',
                        classes: { notchedOutline: 'border-none', input: 'hide-scrollbar' }
                    }} />
                <Button onClick={addComment} variant="contained" className='absolute top-1/2 -translate-y-1/2 right-3 px-2 bg-[#333333] h-[22px] text-sm font-medium text-[#CCCCCC] capitalize'>Comment</Button>
            </div>
            <div>
                {
                    commentList.map(({ commentAuthorImg, commentAuthor, commentText, likeCount, id, commentCreatedAt }, index) => (
                        <div key={index} className='p-3 bg-[#292929] mb-px'>
                            <div className='flex items-center'>
                                <Avatar src={commentAuthorImg} className='w-4 h-4 mr-1' />
                                <span className='text-sm text-[#808080]'>{commentAuthor}</span>
                            </div>
                            <div className='text-[#BBBBBB] text-xs py-2'>
                                {commentText}
                            </div>
                            <div className='flex justify-between items-center text-xs text-[#808080]'>
                                <span>{formatDate(String(commentCreatedAt))}</span>
                                <div className='flex items-center'>
                                    <IconButton onClick={() => likeComment(id)}>
                                        <Image src='/img/svg/ThumbsUp.svg' width={16} height={16} alt='' />
                                    </IconButton>
                                    <span className='mr-2'>{likeCount}</span>
                                    <IconButton onClick={() => unlikeComment(id)}>
                                        <Image src='/img/svg/ThumbsDown.svg' width={16} height={16} alt='' />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default CommentBlock