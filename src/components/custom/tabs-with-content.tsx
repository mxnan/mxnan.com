"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabsWithContentProps {
  tabs: string[];
  tabContent: React.ReactNode[];
  className?: string;
}

const TabsWithContent: React.FC<TabsWithContentProps> = ({
  tabs,
  tabContent,
  className,
}) => {
  const [selected, setSelected] = useState<string>(tabs[0]);

  return (
    <div className={cn("max-w-5xl mx-auto", className)}>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <Tab
            text={tab}
            selected={selected === tab}
            setSelected={setSelected}
            key={tab}
          />
        ))}
      </div>
      <TabContent tabs={tabs} selected={selected} content={tabContent} />
    </div>
  );
};

export default TabsWithContent;

interface TabProps {
  text: string;
  selected: boolean;
  setSelected: (text: string) => void;
}

const Tab: React.FC<TabProps> = ({ text, selected, setSelected }) => {
  return (
    <button
      onClick={() => setSelected(text)}
      className={cn(
        "relative rounded-md px-2 py-1 font-title text-lg font-medium transition-colors",
        selected ? "text-white" : "hover:bg-stone-100 dark:hover:bg-stone-900"
      )}
    >
      <span className="relative capitalize z-10">{text}</span>
      {selected && (
        <motion.span
          layoutId="tab"
          transition={{ type: "spring", duration: 0.4 }}
          className="absolute inset-0 z-0 rounded-lg bg-gray-400 dark:bg-gray-800"
        />
      )}
    </button>
  );
};

interface TabContentProps {
  selected: string;
  content: React.ReactNode[];
  tabs: string[];
}

const TabContent: React.FC<TabContentProps> = ({ tabs, selected, content }) => {
  const selectedIndex = tabs.indexOf(selected);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selected}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{
          type: "tween",
          duration: 0.2,
          damping: 50,
          stiffness: 150,
        }}
      >
        <div className="h-64 overflow-auto w-full rounded-lg p-2 ">
          {content[selectedIndex]}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
