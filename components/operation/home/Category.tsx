import { FormControlLabel, Radio } from "@mui/material";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import RadioGroup from "@mui/material/RadioGroup";
import Done from "@mui/icons-material/Done";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { Language, localeType } from "store/ThemeStore";
import {KeyboardArrowDown} from "@mui/icons-material"
const MyRadioIcon = ({ checked }: { checked?: boolean }) => {
    return (
        <div
            className={`w-[18px] h-[18px] rounded-[50%] p-[5px] box-border border-[1px] border-solid ${
                checked
                    ? " bg-brand-accent-600-600 border-brand-accent-600-600"
                    : " bg-background-primary-White-900 border-primary-100-700"
            }`}
        >
            <div
                className={`w-full h-full rounded-[50%] ${
                    checked ? " bg-primary-900-White" : ""
                }`}
            ></div>
        </div>
    );
};

type Props = {
    open: boolean;
    onClose: () => void;
    findList: any;
    currentCategray: string;
    changeCategray: (value: string) => void;
};

const Category = ({
    onClose,
    open,
    currentCategray,
    changeCategray,
    findList,
}: Props) => {
    const { t } = useTranslation([localeType.HOME, localeType.COMMON]);
    return (
        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            classes={{
                paper: "bg-dropdown-White-800 rounded-t-xl max-h-[70vh] overflow-y-auto !bg-none",
            }}
        >
            <div className="pb-8 ">
                <div className=" h-[52px] leading-[52px] px-4 border-0 relative text-center border-b border-solid border-primary-100-700">
                    <Button onClick={onClose}
                        className="h-[52px] px-0 min-w-0 absolute left-6 top-0" >
                          <KeyboardArrowDown className="text-[24px] text-primary-900-White" />
                    </Button>
                    <span className="text-primary-900-White font-bold text-base normal-case">
                        {t("Category")}
                    </span>
                    <Button
                        onClick={onClose}
                        className="text-base text-info normal-case h-[52px] px-0 min-w-0 absolute right-4 top-0 leading-[52px]"
                    >
                        {t("Done", { ns: localeType.COMMON })}
                    </Button>
                </div>
                <div className="p-3">
                    <RadioGroup
                        value={currentCategray}
                        row
                        name="row-radio-buttons-group"
                        classes={{
                            root: "text-[#C2C2C2] text-sm grid grid-cols-1",
                        }}
                    >
                        <div className="flex">
                            <FormControlLabel
                                value="Sector"
                                control={
                                    <Radio
                                        checkedIcon={<MyRadioIcon checked />}
                                        icon={<MyRadioIcon />}
                                        classes={{
                                            root: `text-[#C2C2C2] `,
                                            checked: "text-[#FF4F20]",
                                        }}
                                    />
                                }
                                label={t("Sector")}
                                classes={{
                                    root: "rounded m-0 p-1 pl-[7px] w-full text-left",
                                    label: "text-base w-full text-primary-900-White",
                                }}
                                onChange={(e: any) => {
                                    changeCategray("Sector");
                                    onClose();
                                }}
                            />
                        </div>
                        {findList &&
                            findList.map((item: any, index: number) => {
                                return (
                                    <div key={item.id} className="flex">
                                        <FormControlLabel
                                            value={item.fullName}
                                            control={
                                                <Radio
                                                    checkedIcon={
                                                        <MyRadioIcon checked />
                                                    }
                                                    icon={<MyRadioIcon />}
                                                    classes={{
                                                        root: `text-[#C2C2C2] `,
                                                        checked:
                                                            "text-[#FF4F20]",
                                                    }}
                                                />
                                            }
                                            label={
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="text-base text-primary-900-White flex items-center">
                                                        <span>
                                                            {item.fullName}
                                                        </span>
                                                        {item.rate > 0 && (
                                                            <span className="text-success-600-500 text-xs ml-2">
                                                                +
                                                                {(+item.rate).toFixed(
                                                                    2
                                                                )}
                                                                %
                                                            </span>
                                                        )}
                                                        {item.rate === 0 && (
                                                            <span className="text-primary-900-White text-xs ml-2">
                                                                0.00%
                                                            </span>
                                                        )}
                                                        {item.rate < 0 && (
                                                            <span className="text-error-600-500 text-xs ml-2">
                                                                {(+item.rate).toFixed(
                                                                    2
                                                                )}
                                                                %
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-primary-900-White">
                                                        {(+item.percentage).toFixed(
                                                            2
                                                        )}
                                                        %
                                                    </div>
                                                </div>
                                            }
                                            classes={{
                                                root: "rounded m-0 p-1 pl-[7px] w-full text-center",
                                                label: "text-base w-full",
                                            }}
                                            onChange={(e: any) => {
                                                //setType(e.target.value);
                                                changeCategray(e.target.value);
                                                onClose();
                                            }}
                                        />
                                    </div>
                                );
                            })}
                    </RadioGroup>
                </div>
            </div>
        </Drawer>
    );
};

export default Category;
