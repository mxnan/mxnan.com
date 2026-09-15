"use client";

import { ScrollStack } from "@/showcase/primitive/scroll-stack";

const cards = [
  {
    id: "1",
    title: "Hello",
    description: "",
  },
  {
    id: "2",
    title: "I",
    description: "",
  },
  {
    id: "3",
    title: "Design",
    description: "",
  },
  {
    id: "4",
    title: "Websites",
    description: "",
  },
  {
    id: "5",
    title: "For",
    description: "",
  },
  {
    id: "6",
    title: "A",
    description: "",
  },
  {
    id: "7",
    title: "Living",
    description: "",
  },
];

export function ScrollStackDemo() {
  return (
    <div>
      <ScrollStack cards={cards} />
    </div>
  );
}
