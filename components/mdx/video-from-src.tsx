"use client";
import React from "react";
import { motion } from "framer-motion";
import { Icons } from "../icons";

export default function VideoFromSrc({
  src,
  title,
  className,
}: {
  src: string;
  title?: string;
  className?: string;
}) {
  const initial = {
    width: "200px",
    height: "200px",
  };

  const animate = {
    width: "auto",
    height: "auto",
    transition: {
      delay: 0.3,
      duration: 1,
      type: "tween",
      stiffness: 100,
      damping: 30,
    },
  };
  return (
    <div className={className}>
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        title={title}
      >
        <source src={src} />
        Your browser does not support the video tag.
      </video>
      <motion.span
        whileInView={animate}
        initial={initial}
        className="absolute z-20 -bottom-2 -right-2 
         min-w-max min-h-max rounded-xl p-3 pb-5 pr-5 text-sm font-semibold bg-secondary
          text-indigo-600 dark:text-lime-400 flex items-end justify-end gap-2
          "
      >
        <Icons.chevronDown className="w-6 h-6 stroke-[5px] group-hover:-rotate-[30deg] transition-transform duration-300 ease-in-out" />{" "}
        {title}
      </motion.span>
    </div>
  );
}
