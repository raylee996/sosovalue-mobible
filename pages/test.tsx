import { Button } from "@mui/material";
import { useRouter } from "next/router";
// import SingleDateRangePicker from "components/base/SingleDateRangePicker";
import { useEffect, useState } from "react";

const Test = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [telegramUrl, setTelegramUrl] = useState("");
  useEffect(() => {
    // setTelegramUrl(`
    // ${window.location.href}
    // ${window.Telegram}
    // ${window.Telegram?.WebApp?.initDataUnsafe}
    // ${window.Telegram?.WebApp?.initData}
    // ${JSON.stringify(router.query)}
    // `);
  }, [router.query]);
  return (
    <div>
      <div className="text-white">{telegramUrl}</div>
      <button
        className=" text-accent-disabled-300"
        type="button"
        onClick={() => {
          throw new Error("Sentry Frontend Error");
        }}
      >
        Throw error
      </button>
      <Button onClick={(e) => setAnchorEl(e.currentTarget)}>test</Button>
      {/* <SingleDateRangePicker
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      /> */}
    </div>
  );
};

export default Test;
