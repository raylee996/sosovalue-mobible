import React, { useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { X } from '@phosphor-icons/react';
import { Drawer } from '@mui/material';

const Iframe = styled('iframe')({
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: '8px',
    scrollbarWidth: 'none', // 隐藏 Firefox 的滚动条
    '&::-webkit-scrollbar': {
        display: 'none', // 隐藏 Chrome, Safari 和 Edge 的滚动条
    },
});

const CustomDialog = ({ open, onClose, url }: any) => {
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                const iframe = document.getElementById('common-iframe') as HTMLIFrameElement;
                iframe.src = url;
                iframe.onload = () => {
                    iframe.contentWindow!.location.hash = iframe.contentWindow!.location.hash;
                };
            }, 1000)
        }
    }, [open, url]);
    return (
        <Drawer
            open={open}
            onClose={onClose}
            anchor="bottom"
            classes={{
                paper: "bg-neutral-bg-1-rest overflow-visible rounded-xl",
            }}
            sx={{
                '& .MuiDrawer-paper': {
                    top: '32px', // 确保 Drawer 的纸张部分也偏移 20px
                    height: 'calc(100% - 32px)', // 调整纸张部分的高度
                    width: '100%',
                    position: 'fixed',
                    backgroundColor: "#fff"
                },
            }}
        >
            <div
                className={`bg-white w-8 h-8 rounded-full z-[9999] absolute ${"right-3 top-3"} flex items-center justify-center z-10 border border-solid border-[#E5E5E5]`}
                onClick={onClose}
            >
                <X size={16} className="text-[#171717]" />
            </div>
            <div className=" rounded-xl w-full h-full">
                <Iframe id="common-iframe" />
            </div>
        </Drawer >
    );
};

export default CustomDialog;
