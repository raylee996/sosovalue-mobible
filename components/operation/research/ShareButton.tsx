import { HTMLAttributes } from "react";
import ShareNewsIcon from "components/svg/ShareNewsIcon";
import { cn } from "helper/cn";
import { useTranslation } from "next-i18next";

const SharedButton: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...elementProps}) => {
    const { t } = useTranslation('common')
    return (
        <div className={cn("flex items-center space-x-1", className)} {...elementProps}>
            <span>{t('Share')}</span>
            <ShareNewsIcon sx={{ fontSize: '16px' }} />
        </div>
    );
}

export default SharedButton;