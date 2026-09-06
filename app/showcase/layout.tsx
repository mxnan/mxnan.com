import { ReactNode } from "react";

export default function ShowcaseLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-h-screen bg-background ">
      <div className="relative min-h-screen pt-16 px-4 lg:px-6">
        {/* Content - Center */}
        <main className="max-w-3xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
