import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AnchorHTMLAttributes, DetailedHTMLProps } from "react";

type CustomLinkProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

const CustomLink = ({ href = "", children, ...props }: CustomLinkProps) => {
  // Internal link (Next.js Link)
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  // Anchor link (same page)
  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  // External link
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      data-cursor="invert"
      className={cn(buttonVariants({ variant: "secondary" }),"px-2 py-0.5")}
    >
      {children}
    </a>
  );
};

export default CustomLink;
