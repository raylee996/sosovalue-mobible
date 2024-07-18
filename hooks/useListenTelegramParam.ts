import { useRouter } from "next/router";
import { useTelegramStartParam } from "./useTelegramStartParam";

/**
 * 监听所有telegram中start参数（tgWebAppStartParam）的hook，实现telegram内的自动跳转。
 * 统一一个hook处理，只在 Layout.tsx 中使用
 */
export const useListenTelegramParam = () => {
    const router = useRouter();

   // news - news 详情
   useTelegramStartParam({ searchKey: "0", onReceive: (value, invitationCode) => {
    router.push(`/news/${value}?inviteCode=${invitationCode}`);
   }});
   // cluster - hot news 详情
   useTelegramStartParam({ searchKey: "1", onReceive: (value, invitationCode) => {
    router.push(`/cluster/${value}?inviteCode=${invitationCode}`);
   }});
   // hot 新闻列表页面
   useTelegramStartParam({ searchKey: "2", onReceive: (invitationCode) => {
    router.push(`/hot?inviteCode=${invitationCode}`);
   }});
};

