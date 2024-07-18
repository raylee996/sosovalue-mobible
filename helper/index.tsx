import { MutableRefObject } from "react";
import { EChartsOption } from "echarts";
import { Theme } from "store/useThemeStore";

// 不用 useRouter 里的 因为有可能没初始化
export const updateQuery = (params: Record<string, string>) => {
  const currentUrl = new URL(location.href);
  const search = currentUrl.searchParams;
  let isUpdate = false;
  Object.entries(params).forEach(([key, value]) => {
    if (search.get(key) !== value) {
      isUpdate = true;
      search.set(key, value);
    }
  });
  if (isUpdate) {
    history.replaceState(
      null,
      "",
      `${currentUrl.pathname}?${search.toString()}`
    );
  }
};

// 设置 css 主题变量
export const setThemeVars = (
  ref: MutableRefObject<HTMLElement | null>,
  theme?: Theme
) => {
  if (ref.current && theme) {
    const prevStyle = ref.current.getAttribute("style") || "";
    const styleVars =
      (theme === "light" ? process.env.lightVars : process.env.darkVars) || "";
    if (!prevStyle.includes(styleVars)) {
      ref.current.setAttribute("style", prevStyle + styleVars);
    }
  }
};

// 获取CSS变量的值
export const cssVar = (x: string) => {
  if (typeof window !== "undefined") {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(x)
      .trim();
  }
  return x;
};

// ~~~ echart 配置参考 ~~~
export const tooltipOptions: Partial<EChartsOption["tooltip"]> = {
  padding: 0,
  borderWidth: 0,
  textStyle: {
    fontSize: 10,
  },
  backgroundColor: 'transparent',
  extraCssText: "z-index: 10;",
  position: (pos, params, dom, rect, size) => {
    const gap = 4;
    const [x, y] = pos;
    const w = size.contentSize[0];
    const _x = pos[0] < size.viewSize[0] / 2 ? x + gap : x - w - gap;
    return [_x, y];
  },
};

interface FormatterTmlProps {
  title: string;
  list: { color: string; name: string; value: string }[];
}

export const formatterTml = (props: FormatterTmlProps) => {
  const { title, list } = props;
  return `
    <div class="text-primary-900-White bg-dropdown-White-800 p-1.5 rounded flex flex-col">
      <div class="">${title}</div>
      ${list
        .map(
          ({ color, name, value }) => `
        <div class="flex justify-start items-center gap-1">
          <span style="background: ${color}" class="inline-flex w-2 h-2 text-secondary-500-300 rounded-full"></span>
          <span>${name}:</span>
          <span>${value}</span>
        </div>
      `
        )
        .join("")}
    </div>
  `;
};
