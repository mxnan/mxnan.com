import React from "react";
// import "@/styles/mdx.css";

export default function BlogsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <div className="max-w-none mx-auto pt-32 px-4 lg:px-6">
      {children}
    </div>

  );
}
