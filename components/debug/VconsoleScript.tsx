import Script from "next/script";

declare const VConsole: any;

export default function VConsoleScript() {
    return (
      <Script
        src="https://unpkg.com/vconsole@latest/dist/vconsole.min.js"
        onReady={() => {
          new VConsole();
        }}
      />
    );
  }