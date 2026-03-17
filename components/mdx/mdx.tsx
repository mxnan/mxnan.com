import * as runtime from "react/jsx-runtime";

// parse the Velite generated MDX code into a React component function
const useMDXComponent = (code: string) => {
  // eslint-disable-next-line no-new-func
  const fn = new Function(code) as (rt: typeof runtime) => { default: unknown };
  return fn({ ...runtime }).default as React.ComponentType;
};

export interface MDXProps {
  code: string;
}

export function Mdx({ code }: MDXProps) {
  const Component = useMDXComponent(code);
  return <Component />;
}

