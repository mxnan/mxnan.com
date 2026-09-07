import React from "react";
// import "@/styles/mdx.css";

export default function BlogsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen pt-16 px-4 lg:px-6">
      <div className="mx-auto w-full max-w-3xl">{children}</div>
    </div>
  );
}
