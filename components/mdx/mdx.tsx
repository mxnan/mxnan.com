/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as runtime from "react/jsx-runtime";
import { useMemo } from "react";
import { BaseComponents } from "./base-mdx";
import { Button } from "../ui/button";
import MDXErrorBoundary from "./error-boundary";
import { CollapsibleCodeBlock } from "./mdx-ui/collapsible-codeblock";
import { MDXImage } from "./mdx-ui/mdx-image";
import { FigCard } from "./mdx-ui/figcard";

const blogComponents = {
  ...BaseComponents,
  Button,
  FigCard,
  CollapsibleCodeBlock,
  img: MDXImage,
  Image: MDXImage,
};

const mdxComponentCache = new Map<string, React.ComponentType<any>>();

function getMDXComponent(code: string): React.ComponentType<any> {
  if (mdxComponentCache.has(code)) {
    return mdxComponentCache.get(code)!;
  }

  const fn = new Function(code) as (args: { [key: string]: unknown }) => {
    default: React.ComponentType<any>;
  };
  const component = fn({ ...runtime }).default;
  mdxComponentCache.set(code, component);

  return component;
}

export function MDXContent({ code }: { code: string }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return (
    <MDXErrorBoundary>
      <div className="relative h-full w-full">
        <Component components={blogComponents} />
      </div>
    </MDXErrorBoundary>
  );
}
