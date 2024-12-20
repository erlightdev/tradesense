import * as React from "react";

const TradesenseLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={32}
    height={32}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M15 15.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0" fill="currentColor" />
    <path
      opacity={0.4}
      d="M22 8.5a6.5 6.5 0 0 1-7.02 6.48 6.51 6.51 0 0 0-5.96-5.96A6.5 6.5 0 1 1 22 8.5"
      fill="currentColor"
    />
    <path
      d="M5.59 2H3c-.55 0-1 .45-1 1v2.59c0 .89 1.08 1.34 1.71.71L6.3 3.71C6.92 3.08 6.48 2 5.59 2m12.82 20H21c.55 0 1-.45 1-1v-2.59c0-.89-1.08-1.34-1.71-.71l-2.59 2.59c-.62.63-.18 1.71.71 1.71"
      fill="currentColor"
    />
  </svg>
);

export default TradesenseLogo;
