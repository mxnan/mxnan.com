"use client";

import { createContext, useContext, type RefObject } from "react";

type ComponentPreviewScroller = RefObject<HTMLDivElement | null>;

const ComponentPreviewScrollContext =
  createContext<ComponentPreviewScroller | null>(null);

export function useComponentPreviewScroller() {
  return useContext(ComponentPreviewScrollContext);
}

export { ComponentPreviewScrollContext };
