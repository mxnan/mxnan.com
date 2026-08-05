"use client";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { motion, useMotionValue, useTransform } from "motion/react";

// ─── Animation variants (hoisted outside component) ───────────────────────
const MOTION_DURATION = 0.7;

const SUN_VARIANTS = {
    checked: { scale: 0 },
    unchecked: { scale: 1 },
};

const MOON_VARIANTS = {
    checked: { scale: 1 },
    unchecked: { scale: 0 },
};

const SolarSwitch = ({ isDark }: { isDark: boolean }) => {
    const scaleMoon = useMotionValue(isDark ? 1 : 0);
    const scaleSun = useMotionValue(isDark ? 0 : 1);
    const pathLengthMoon = useTransform(scaleMoon, [0.6, 1], [0, 1]);
    const pathLengthSun = useTransform(scaleSun, [0.6, 1], [0, 1]);

    return (
        <motion.div animate={isDark ? "unchecked" : "checked"}>
            <motion.svg
                width="20"
                height="20"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Sun circle */}
                <motion.path
                    d="M12.4058 17.7625C15.1672 17.7625 17.4058 15.5239 17.4058 12.7625C17.4058 10.0011 15.1672 7.76251 12.4058 7.76251C9.64434 7.76251 7.40576 10.0011 7.40576 12.7625C7.40576 15.5239 9.64434 17.7625 12.4058 17.7625Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={SUN_VARIANTS}
                    custom={isDark}
                    transition={{ duration: MOTION_DURATION }}
                    style={{
                        pathLength: pathLengthSun,
                        scale: scaleSun,
                    }}
                />

                {/* Sun rays */}
                {[
                    "M12.4058 1.76251V3.76251",
                    "M12.4058 21.7625V23.7625",
                    "M4.62598 4.98248L6.04598 6.40248",
                    "M18.7656 19.1225L20.1856 20.5425",
                    "M1.40576 12.7625H3.40576",
                    "M21.4058 12.7625H23.4058",
                    "M4.62598 20.5425L6.04598 19.1225",
                    "M18.7656 6.40248L20.1856 4.98248",
                ].map((d, idx) => (
                    <motion.path
                        key={idx}
                        d={d}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={SUN_VARIANTS}
                        custom={isDark}
                        transition={{ duration: MOTION_DURATION }}
                        style={{
                            pathLength: pathLengthSun,
                            scale: scaleSun,
                        }}
                    />
                ))}

                {/* Moon */}
                <motion.path
                    d="M21.1918 13.2013C21.0345 14.9035 20.3957 16.5257 19.35 17.8781C18.3044 19.2305 16.8953 20.2571 15.2875 20.8379C13.6797 21.4186 11.9398 21.5294 10.2713 21.1574C8.60281 20.7854 7.07479 19.9459 5.86602 18.7371C4.65725 17.5283 3.81774 16.0003 3.4457 14.3318C3.07367 12.6633 3.18451 10.9234 3.76526 9.31561C4.346 7.70783 5.37263 6.29868 6.72501 5.25307C8.07739 4.20746 9.69959 3.56862 11.4018 3.41132C10.4052 4.75958 9.92564 6.42077 10.0503 8.09273C10.175 9.76469 10.8957 11.3364 12.0812 12.5219C13.2667 13.7075 14.8384 14.4281 16.5104 14.5528C18.1823 14.6775 19.8435 14.1979 21.1918 13.2013Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transition={{ duration: MOTION_DURATION }}
                    variants={MOON_VARIANTS}
                    custom={isDark}
                    style={{
                        pathLength: pathLengthMoon,
                        scale: scaleMoon,
                    }}
                />
            </motion.svg>
        </motion.div>
    );
};


const ThemeToggle = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [canRender, setCanRender] = useState(false);

    // Only render after hydration to prevent mismatch
    useEffect(() => {
        setCanRender(true);
    }, []);

    const toggleTheme = useCallback(() => {
        const isDark = resolvedTheme === "dark";
        const nextTheme = isDark ? "light" : "dark";

        // Use View Transitions API if available for smoother theme switch
        if ("startViewTransition" in document) {
            (document as any).startViewTransition(() => {
                setTheme(nextTheme);
            });
        } else {
            setTheme(nextTheme);
        }
    }, [resolvedTheme, setTheme]);

    // Prevent hydration mismatch
    if (!canRender) {
        return (
            <Button
                variant="default"
                size="icon"
                disabled
                aria-label="Loading theme"
            >
                <div className="h-5 w-5 rounded-full bg-muted animate-pulse" />
            </Button>
        );
    }

    const isDark = resolvedTheme === "dark";

    return (
        <Button
            onClick={toggleTheme}
            variant="default"
            size="icon"
            className="hover:bg-muted-foreground"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
            <SolarSwitch isDark={isDark} />
        </Button>
    );
};

export default ThemeToggle;