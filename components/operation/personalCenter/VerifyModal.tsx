import { ReactElement, Ref, forwardRef, useState } from "react";
import NiceModal, { useModal, muiDialogV5 } from "@ebay/nice-modal-react";
import Dialog from "@mui/material/Dialog";
import ButtonBase from "@mui/material/ButtonBase";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import ArrowLeft from "components/icons/arrow-left.svg";
import CheckSvg from "components/icons/checked.svg";
import LogoIcon from "components/icons/logo";
import { Divider, Link, MenuItem, OutlinedInput, Select } from "@mui/material";
import { InputAdornment } from "@mui/material";

const SlideLeft = forwardRef(
  (
    props: TransitionProps & {
      children: ReactElement;
    },
    ref: Ref<unknown>
  ) => <Slide direction="left" ref={ref} {...props} />
);

interface Props {
  options: any[];
  value?: string;
  onChange?(val: string): void;
}

const VerifyModal = NiceModal.create((props: Props) => {
  const { options, value, onChange } = props;
  const modal = useModal();

  const handleCheck = (val: string) => {
    onChange?.(val);
    modal.resolve(val);
    modal.hide();
  };

  const [selectedCode, setSelectedCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);

  const countryCodes = [
    { value: "+1", label: "🇺🇸 +1" },
    { value: "+86", label: "🇨🇳 +86" },
    { value: "+91", label: "🇮🇳 +91" },
    // 添加更多的区号选项
  ];

  const handleCodeChange = (event: any) => {
    setSelectedCode(event.target.value);
  };

  const handleEmailChange = (event: any) => {
    const value = event.target.value;
    setEmail(value);
  };

  const handlePasswordChange = (event: any) => {
    const value = event.target.value;
    setPassword(value);
  };

  const handlePhoneNumberChange = (event: any) => {
    const value = event.target.value;
    setPhoneNumber(value);
    // 验证电话号码是否有效（这里只是一个简单的验证示例）
    const phoneRegex = /^[0-9]{10}$/;
    setIsValid(phoneRegex.test(value));
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // 处理表单提交
    if (isValid) {
      console.log("Country Code:", selectedCode);
      console.log("Phone Number:", phoneNumber);
    } else {
      alert("请输入有效的电话号码");
    }
  };

  return (
    <Dialog fullScreen TransitionComponent={SlideLeft} {...muiDialogV5(modal)}>
      <header className="header-base text-center relative">
        <ButtonBase
          onClick={() => modal.hide()}
          className="svg-icon-base text-primary-800-50 absolute left-4 top-2"
        >
          <ArrowLeft />
        </ButtonBase>
        <span className="h-9 inline-flex items-center">Verify</span>
      </header>
      <div className="bg-dropdown-White-800 text-primary-900-White text-sm h-full p-8">
        <div className="w-full text-center mb-6">
          <LogoIcon full />
        </div>
        <div className="w-full">
          <div className="text-sm font-semibold mb-2 text-primary-900-White">
            Phone number
          </div>

          <OutlinedInput
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            // autoComplete="new-email"
            fullWidth
            type="tel"
            placeholder={`Enter Phone Number...`}
            className="h-[40px] rounded-lg bg-background-primary-White-900 border border-solid border-primary-100-700 outline-none flex justify-between items-center"
            classes={{
              input: "h-full text-sm leading-6 flex-1",
              notchedOutline: `border`,
            }}
            sx={{
              ".MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
            startAdornment={
              <InputAdornment
                position="start"
                className="flex items-center h-auto"
              >
                <Select
                  value={selectedCode}
                  onChange={handleCodeChange}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  sx={{
                    ".MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    ".MuiSelect-select": {
                      padding: "0", // 调整 padding
                    },
                    "& .MuiSelect-icon": {
                      right: "8px", // 调整下拉箭头的位置
                    },
                  }}
                >
                  {countryCodes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <Divider
                  orientation="vertical"
                  flexItem
                  className="bg-secondary-500-300 h-5 mx-1"
                />
              </InputAdornment>
            }
            endAdornment={isValid ? <CheckSvg /> : null}
          />
        </div>

        <div className="w-full ">
          <div className="text-sm font-semibold mb-2 text-primary-900-White">
            Email
          </div>

          <OutlinedInput
            value={email}
            onChange={handleEmailChange}
            autoComplete="new-email"
            fullWidth
            type="email"
            placeholder={`Enter Email...`}
            className="h-[40px] rounded-lg bg-background-primary-White-900 border border-solid border-primary-100-700 outline-none flex justify-between items-center"
            classes={{
              input: "h-full text-sm leading-6 flex-1",
              notchedOutline: `border`,
            }}
            sx={{
              ".MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
            endAdornment={isValid ? <CheckSvg /> : null}
          />
        </div>

        <div className="w-full mt-5">
          <div className="text-sm font-semibold mb-2 text-primary-900-White">
            Password
          </div>

          <OutlinedInput
            value={password}
            onChange={handlePasswordChange}
            // autoComplete="new-email"
            fullWidth
            type="password"
            placeholder={`Enter password...`}
            className="h-[40px] rounded-lg bg-background-primary-White-900 border border-solid border-primary-100-700 outline-none flex justify-between items-center"
            classes={{
              input: "h-full text-sm leading-6 flex-1",
              notchedOutline: `border`,
            }}
            sx={{
              ".MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
            endAdornment={isValid ? <CheckSvg /> : null}
          />
        </div>

        <ButtonBase className="w-full px-5 py-2 flex items-center justify-center rounded-lg bg-brand-accent-600 my-5 text-sm font-medium leading-6 text-white-white">
          Next
        </ButtonBase>

        <div className="text-xs text-secondary-500-300">
          By signing up,you agree to our{" "}
          <Link
            href="https://alpha.sosovalue.xyz/blog/terms-of-service"
            className="text-secondary-500-300 decoration-secondary-500-300"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="https://alpha.sosovalue.xyz/blog/privacy-policy"
            className="text-secondary-500-300 decoration-secondary-500-300"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </Dialog>
  );
});

export default VerifyModal;
