"use client";

import * as runtime from "react/jsx-runtime";
import { BaseComponents } from "./base-mdx";
import { Button } from "../ui/button";
import Link from "next/link";
import MDXErrorBoundary from "./error-boundary";
import { FigCard } from "./mdx-ui/figcard";
import { ComponentPreview } from "./component-preview";


// ---------------------- Component maps ---------------------

const coreComponents = {
  ...BaseComponents,
  Button,
  FigCard,
  a: Link,
};

const blogComponents = {
  ...coreComponents,
};

const componentComponents = {
  ...coreComponents,
  ComponentPreview,
};

// ---------------------- MDX Runtime ---------------------

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

// ---------------------- TYPES ---------------------

type MDXType = "blog" | "component";

interface MDXProps {
  code: string;
  type?: MDXType; // 👈 key addition
}

// ---------------------- COMPONENT ---------------------

export function MDXContent({ code, type = "blog" }: MDXProps) {
  const Component = useMDXComponent(code);

  const components =
    type === "component" ? componentComponents : blogComponents;

  return (
    <MDXErrorBoundary>
      <div className="w-full h-full relative">
        <Component components={components} />
      </div>
    </MDXErrorBoundary>
  );
}