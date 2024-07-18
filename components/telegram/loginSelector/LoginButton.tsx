import { type PropsWithChildren } from "react";
import { Button, ButtonProps } from "@mui/material";
import { cn } from "helper/cn";

interface Props extends PropsWithChildren, ButtonProps {
    icon?: React.ReactNode;
}

const LoginButton: React.FC<Props> = ({ children, icon = null, variant = 'contained', className, ...restButtonProps }) => {
    return (
        <Button
            fullWidth
            variant={variant}
            disableRipple={variant !== 'contained'}
            className={cn("flex justify-between items-center h-12 px-6 rounded-lg transition-colors text-primary-900-White", {
                ['bg-background-secondary-White-700']: variant === 'contained',
                ['active:bg-transparent hover:bg-transparent']: variant === 'text'
            }, className)}
            {...restButtonProps}
        >
            {children}
            {icon}
        </Button>
    );
};

export default LoginButton;
