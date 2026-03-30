import React from "react";
// import "@/styles/mdx.css";

export default function BlogsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative w-full min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-24">
        {children}
      </div>
    </div>
  );
}
