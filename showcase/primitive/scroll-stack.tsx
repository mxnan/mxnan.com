"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";
import { useComponentPreviewScroller } from "@/components/mdx/component-preview-scroll-context";
import { cn } from "@/lib/utils";

export type ScrollStackCard = {
  id: string;
  title: string;
  description?: string;
};

type ScrollStackProps = {
  cards: ScrollStackCard[];
  className?: string;
};

const CARD_HEIGHT = 22;
const RELEASE_SPACE = 8;

export function ScrollStack({ cards, className }: ScrollStackProps) {
  const shouldReduceMotion = useReducedMotion();
  const scroller = useComponentPreviewScroller();
  const stackRef = useRef<HTMLDivElement>(null);

  const total = cards.length;

  const { scrollYProgress } = useScroll({
    target: stackRef,
    container: scroller ?? undefined,
    offset: ["start start", "end end"],
  });

  if (total === 0) {
    return null;
  }

  return (
    <section
      ref={stackRef}
      className={cn("relative w-full", className)}
      style={{
        height: `${total * CARD_HEIGHT + RELEASE_SPACE}rem`,
      }}
    >
      <div className="sticky top-0 w-full p-3 sm:p-4">
        <div className="grid w-full place-items-start">
          {cards.map((card, index) => (
            <StackedCard
              key={card.id}
              card={card}
              index={index}
              total={total}
              progress={scrollYProgress}
              reduceMotion={Boolean(shouldReduceMotion)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StackedCard({
  card,
  index,
  total,
  progress,
  reduceMotion,
}: {
  card: ScrollStackCard;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const isFirst = index === 0;

  /*
   * Reserve the final 10% of the timeline for the sticky
   * container to naturally release.
   */
  const animationEnd = 0.9;

  /*
   * Each card owns one equal section of the animation.
   */
  const step = animationEnd / Math.max(total, 1);

  const start = index * step;
  const enterEnd = start + step * 0.7;

  /*
   * IMPORTANT:
   *
   * Every non-first card is explicitly held at 110%
   * BEFORE its turn starts.
   *
   * This is what prevents card N from being visible
   * underneath the first card on initial render.
   */
  const y = useTransform(
    progress,
    isFirst ? [0, 1] : [0, start, enterEnd, animationEnd],
    isFirst ? ["0%", "0%"] : ["110%", "110%", "0%", "0%"],
  );

  /*
   * Previous cards become slightly smaller as the next
   * card takes over.
   */
  const exitStart = enterEnd;
  const exitEnd = Math.min(start + step, animationEnd);

  const scale = useTransform(
    progress,
    isFirst ? [0, 1] : [exitStart, exitEnd],
    isFirst ? [1, 0.965] : [1, 0.965],
  );

  const opacity = useTransform(
    progress,
    isFirst ? [0, 1] : [exitStart, exitEnd],
    isFirst ? [1, 0.82] : [1, 0.82],
  );

  return (
    <motion.article
      style={{
        gridArea: "1 / 1",
        y: reduceMotion ? "0%" : y,
        scale: reduceMotion ? 1 : scale,
        opacity: reduceMotion ? 1 : opacity,
        zIndex: index + 1,
      }}
      className={cn(
        "relative w-full max-w-3xl",
        "min-h-60 sm:min-h-64",
        "rounded-[28px]",
        "border border-border",
        "bg-card",
        "p-6 sm:p-8",
        "shadow-xl shadow-muted/10",
        "will-change-transform",
      )}
    >
      <div className="flex min-h-48 flex-col justify-between gap-8 sm:min-h-52">
        <div>
          <span className="text-xs font-medium uppercase tracking-[0.16em] opacity-50">
            {String(index + 1).padStart(2, "0")}
          </span>

          <h2 className="mt-5 text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
            {card.title}
          </h2>
        </div>

        {card.description && (
          <p className="max-w-xl text-sm leading-relaxed opacity-70 sm:text-base">
            {card.description}
          </p>
        )}
      </div>
    </motion.article>
  );
}
