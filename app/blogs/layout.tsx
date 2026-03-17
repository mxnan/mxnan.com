import React from "react";
// import "@/styles/mdx.css";

export default function BlogsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="relative flex-1">
        {children}
      </div>
    </div>
  );
}
