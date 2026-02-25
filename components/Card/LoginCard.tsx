import { type PropsWithChildren } from "react";

const LoginCard = ({ children }: PropsWithChildren) => (
  <div
    className="flex items-center justify-center min-h-screen"
    style={{ background: "var(--background)" }}
  >
    <div
      className="flex w-full max-w-4xl shadow-lg rounded-lg overflow-hidden h-[450px] gap-10"
      style={{ background: "var(--background-secondary)" }}
    >
      {children}
    </div>
  </div>
);

export default LoginCard;
