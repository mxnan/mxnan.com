import React from "react";
// import "@/styles/mdx.css";

export default function BlogsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex-1">
      <div className="max-w-3xl mx-auto">
        {children}
      </div>
    </div>
  );
}
