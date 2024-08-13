//components sidebar config//
//define new components here ,so their links aregenerated in sidebar

export const componentSidebar: {
  category: string;
  items: { name: string; href: string }[];
}[] = [
  {
    category: "Buttons",
    items: [{ name: "Shimmer", href: "/components/buttons/shimmer-button" }],
  },
  {
    category: "Loaders",
    items: [{ name: "Bounce", href: "/components/loaders/bounce-loader" }],
  },

  // Add more categories and items as needed
];

export const mobileNavlinks: { name: string; link: string }[] = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Components",
    link: "/components",
  },

  {
    name: "Blogs",
    link: "/blogs",
  },

  {
    name: "Contact",
    link: "/contact",
  },
];