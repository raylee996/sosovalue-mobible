import { OutlinedInput, OutlinedInputProps } from "@mui/material";
import SearchIcon from "components/svg/Search";
import { cn } from "helper/cn";

type Props = Omit<OutlinedInputProps, "startAdornment">;

const InputSearch: React.FC<Props> = props => {
  const { className, classes, ...rest } = props;

  return (
    <OutlinedInput
      className={cn("h-10 px-0", className)}
      classes={{
        ...classes,
        input: cn("h-full py-0 text-sm text-primary-900-White px-2", classes?.input),
        adornedStart: "flex item-center justify-center px-2 text-primary-900-White",
        notchedOutline: "border border-primary-100-700",
      }}
      {...rest}
      startAdornment={<SearchIcon />}
    />
  );
};

export default InputSearch;
