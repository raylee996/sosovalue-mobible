import { Typography } from "@mui/material";
import { cn } from "helper/cn";

type Props = {
    title: string;
    content: string;
    banner?: React.ReactNode;
    /**
     * @default "medium"
     */
    size?: "small" | "medium";
};

const GuideCard: React.FC<Props> = ({ title, content, banner = null, size = "medium" }) => {
    const titleVariant = size === "small" ? "subtitle1" : "h6";

    return (
        <section className={cn({
            "bg-[rgba(0,0,0,0.48)]": !!banner
        })}>
            {banner && <div className="rounded-t-lg">{banner}</div>}
            
            <div 
                className={cn({
                    "bg-[#171717] py-3 px-4 rounded-b-lg": !!banner,
                })}>
                <Typography variant={titleVariant} gutterBottom className="font-bold text-primary-900-White">
                    {title}
                </Typography>
                <Typography variant="body2" gutterBottom className="text-primary-900-White">
                    {content}
                </Typography>
            </div>
        </section>
    );
};

export default GuideCard;
