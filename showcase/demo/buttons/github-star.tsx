"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { easings } from "@/lib/motion/easings";
import type { HTMLMotionProps } from "motion/react";

interface GithubStarButtonProps extends HTMLMotionProps<"a"> {
    href?: string;
}

const buttonVariants = {
    initial: { opacity: 0, y: -24 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: easings.exit,
        }
    },
};

const starVariants = {
    initial: { pathLength: 0, scale: 1 },
    hover: {
        pathLength: 1,
        scale: 1.1,
        transition: {
            duration: 0.4,
            ease: easings.smooth,
        }
    },
};

const bgVariants = {
    initial: { opacity: 0, scale: 1 },
    hover: {
        opacity: 1,
        scale: 1.05,
        transition: {
            duration: 0.4,
            ease: easings.exit,
        }
    },
};

const textVariants = {
    initial: { y: -40 },
    hover: {
        y: 0,
        transition: {
            duration: 0.4,
            ease: easings.smooth,
        }
    },
};

export const GithubStarButton = React.forwardRef<
    HTMLAnchorElement,
    GithubStarButtonProps
>(
    (
        {
            className,
            href = "https://github.com/mxnan/nextjs-velite-tailwind-framer",
            ...props
        },
        ref
    ) => {
        return (
            <section className="z-10 mx-auto">
                <motion.a
                    ref={ref}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Star repository on GitHub"
                    variants={buttonVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    className={cn(
                        "group w-full max-w-sm mx-auto flex justify-center items-center gap-6 px-4 py-2 rounded-xl border",
                        "bg-primary border-primary overflow-hidden",
                        className
                    )}
                    {...props}
                >
                    {/* LEFT TEXT */}
                    <span className="flex items-center gap-1 text-lg font-medium text-primary-foreground">
                        Find Repo
                        <svg
                            viewBox="0 0 24 24"
                            className="w-6 h-6 stroke-[3] stroke-current fill-none transition-transform duration-500 group-hover:translate-x-2 group-hover:scale-90"
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </span>

                    {/* RIGHT CTA */}
                    <span className="relative flex items-center gap-2 px-2 py-1">
                        <motion.span
                            variants={bgVariants}
                            className="absolute inset-0 rounded-lg bg-accent"
                        />

                        <motion.span
                            variants={textVariants}
                            className="relative z-10 font-semibold text-primary"
                        >
                            Give a Star
                        </motion.span>

                        <svg
                            viewBox="0 0 24 24"
                            className="w-5 h-5 stroke-2 stroke-primary fill-transparent relative z-10"
                        >
                            <motion.polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                                variants={starVariants}
                            />
                        </svg>
                    </span>
                </motion.a>
            </section>
        );
    }
);

GithubStarButton.displayName = "GithubStarButton";