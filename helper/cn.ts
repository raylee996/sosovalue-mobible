import clx from "clsx";
import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";

/**
 * @description
 * 针对tailwindcss使用clsx场景的封装，用于合并tailwindcss的同类class，解决类名冲突及冗余问题。用法与clsx一致。
 * @example
 * ```ts
 * // 根据先后顺序，后面的 class 会覆盖前面的 class
 * const cls = cn({ "text-primary": selected }, "text-red-500", "text-red-600");
 * console.log(cls); // text-red-600
 * ```
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clx(...inputs));
