import * as runtime from "react/jsx-runtime";
import { BaseComponents } from "./base-mdx"; // import for base components
import { Button } from "../ui/button";
import Link from "next/link";
import MDXErrorBoundary from "./error-boundary";
import { FigCard } from "./mdx-ui/figcard";

// ---------------------- Component maps by responsibility ---------------------

// Core components shared across all MDX routes (blogs, generic pages)
const coreComponents = {
  ...BaseComponents,
  Button,
  FigCard,
  // Image,
};
const extraComponent = {
  a: Link,
};

// Component map for blog / generic MDX pages (no trip-specific components)
const blogComponents = {
  ...coreComponents,
};


// parse the Velite generated MDX code into a React component function
const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

interface MDXProps {
  code: string;
}


export function MDXContent({ code }: MDXProps) {
  const Component = useMDXComponent(code);
  return (
    <MDXErrorBoundary>
      <section className="w-full h-full relative">
        <Component components={blogComponents} />
      </section>
    </MDXErrorBoundary>
  );
}

