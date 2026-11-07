import { Home, BookText, MailPlus, type LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  ariaLabel: string;
}

export const HEADER_NAV: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    ariaLabel: "Navigate to home",
  },
  {
    label: "Blogs",
    href: "/blogs",
    icon: BookText,
    ariaLabel: "View blog posts",
  },
  {
    label: "Contact",
    href: "/contact",
    icon: MailPlus,
    ariaLabel: "Contact me",
  },
];
