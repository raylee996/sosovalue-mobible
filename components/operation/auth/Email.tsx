import { useTranslation } from "next-i18next";
import AuthInputField, { AuthInputFieldProps } from "./AuthInputField";
import Regex from "helper/regex";

type Props = Partial<AuthInputFieldProps>;

const Email = (props: Props) => {
  const { t } = useTranslation("common");
  const { rules, ref, className, ...rest } = props;

  return (
    <AuthInputField
      labelText={t("Email")}
      placeholder={t("Enter email") as string}
      className={className}
      rules={{
        pattern: [
          {
            value: /[^^.!%+\-_@]/g,
            message: t("Invalid characters in email"),
          },
          { value: Regex.email, message: t("Invalid email format") },
        ],
        ...rules,
      }}
      {...rest}
    />
  );
};

export default Email;
