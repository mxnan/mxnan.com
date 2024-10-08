import { cn } from "@/lib/utils";
import React from "react";
import CustomLink from "./custom-link";
import { Callout } from "./call-out";

export const basecomponents = {
  //////////////////////////////////////////////////////////////////////
  // html components
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        "mb-10 scroll-m-20 uppercase text-4xl lg:text-6xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  // custom heading for toc component
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const id = React.useMemo(() => {
      if (props.id) return props.id;
      if (typeof props.children === "string") {
        return props.children.toLowerCase().replace(/\s+/g, "-");
      }
      return "";
    }, [props.id, props.children]);

    return (
      <div className="relative h-10 w-max">
        <h2
          id={id}
          className={cn(
            "mt-10 scroll-m-10 pb-3 pr-4 text-2xl font-semibold capitalize custom-underline cursor-pointer ",
            className
          )}
          {...props}
        />
      </div>
    );
  },
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "capitalize mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        "font-title mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className={cn(
        "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className={cn(
        "mt-8 scroll-m-20 text-base font-medium tracking-tight",
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn("leading-7  [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <li className={cn("mt-2 text-sm", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={cn("my-6 w-max border-x-4  border-gray-500 px-6 italic", className)}
      {...props}
    />
  ),
  //////////////////////////////////////////////////////////////////////
  // custom components down here

  hr: ({ ...props }) => <hr className="my-10 max-w-3xl w-full border-gray-300 dark:border-gray-700" {...props} />,

  // customLink
  a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <CustomLink
      className={cn(
        "font-semibold text-gray-500 dark:text-gray-600 custom-underline mx-1 pb-2 text-sm",
        className
      )}
      {...props}
    />
  ),
  /////// steps
  Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className={cn(
        "my-8 scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  Steps: ({ ...props }) => (
    <div
      className="[&>h3]:step steps mb-12 ml-4 border-l border-gray-300 dark:border-gray-700 pl-8 [counter-reset:step]"
      {...props}
    />
  ),

  // callout
  Callout,
};
