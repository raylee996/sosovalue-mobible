
import React from 'react';
import { BarLoader } from "react-spinners";
import { styled } from '@mui/material/styles';
import LogoFull from "components/icons/logo/logo-full.svg";

const Overlay = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff', // 半透明黑色背景
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // 确保在最前面显示
});

const LoadingOverlay = ({ open }: { open: boolean }) => {
    if (!open) return null;

    return (
        <Overlay>
            <LogoFull className="mb-4 text-[#0a0a0a]" />
            <BarLoader
                color="#FF4F20"
                cssOverride={{ borderRadius: 2, width: 180 }}
            />
        </Overlay>
    );
};

export default LoadingOverlay;
