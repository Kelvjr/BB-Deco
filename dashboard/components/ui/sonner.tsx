"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "white",
          "--normal-text": "#0f172a",
          "--normal-border": "rgba(15, 23, 42, 0.1)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
