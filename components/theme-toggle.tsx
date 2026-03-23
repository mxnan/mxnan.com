"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { motion, useMotionValue, useTransform } from "motion/react";


const SolarSwitch = ({ isDark }: { isDark: boolean }) => {
    const duration = 0.7;

    const moonVariants = {
        checked: {
            scale: 1,
        },
        unchecked: {
            scale: 0,
        },
    };

    const sunVariants = {
        checked: {
            scale: 0,
        },
        unchecked: {
            scale: 1,
        },
    };
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
                <motion.path
                    d="M12.4058 17.7625C15.1672 17.7625 17.4058 15.5239 17.4058 12.7625C17.4058 10.0011 15.1672 7.76251 12.4058 7.76251C9.64434 7.76251 7.40576 10.0011 7.40576 12.7625C7.40576 15.5239 9.64434 17.7625 12.4058 17.7625Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={sunVariants}
                    custom={isDark}
                    transition={{ duration }}
                    style={{
                        pathLength: pathLengthSun,
                        scale: scaleSun,
                    }}
                />
                <motion.path
                    d="M12.4058 1.76251V3.76251"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={sunVariants}
                    custom={isDark}
                    transition={{ duration }}
                    style={{
                        pathLength: pathLengthSun,
                        scale: scaleSun,
                    }}
                />
                <motion.path
                    d="M12.4058 21.7625V23.7625"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={sunVariants}
                    custom={isDark}
                    transition={{ duration }}
                    style={{
                        pathLength: pathLengthSun,
                        scale: scaleSun,
                    }}
                />
                <motion.path
                    d="M4.62598 4.98248L6.04598 6.40248"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={sunVariants}
                    custom={isDark}
                    transition={{ duration }}
                    style={{
                        pathLength: pathLengthSun,
                        scale: scaleSun,
                    }}
                />
                <motion.path
                    d="M18.7656 19.1225L20.1856 20.5425"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={sunVariants}
                    custom={isDark}
                    transition={{ duration }}
                    style={{
                        pathLength: pathLengthSun,
                        scale: scaleSun,
                    }}
                />
                <motion.path
                    d="M1.40576 12.7625H3.40576"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={sunVariants}
                    custom={isDark}
                    transition={{ duration }}
                    style={{
                        pathLength: pathLengthSun,
                        scale: scaleSun,
                    }}
                />
                <motion.path
                    d="M21.4058 12.7625H23.4058"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={sunVariants}
                    custom={isDark}
                    transition={{ duration }}
                    style={{
                        pathLength: pathLengthSun,
                        scale: scaleSun,
                    }}
                />
                <motion.path
                    d="M4.62598 20.5425L6.04598 19.1225"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={sunVariants}
                    custom={isDark}
                    transition={{ duration }}
                    style={{
                        pathLength: pathLengthSun,
                        scale: scaleSun,
                    }}
                />
                <motion.path
                    d="M18.7656 6.40248L20.1856 4.98248"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={sunVariants}
                    custom={isDark}
                    transition={{ duration }}
                    style={{
                        pathLength: pathLengthSun,
                        scale: scaleSun,
                    }}
                />
                <motion.path
                    d="M21.1918 13.2013C21.0345 14.9035 20.3957 16.5257 19.35 17.8781C18.3044 19.2305 16.8953 20.2571 15.2875 20.8379C13.6797 21.4186 11.9398 21.5294 10.2713 21.1574C8.60281 20.7854 7.07479 19.9459 5.86602 18.7371C4.65725 17.5283 3.81774 16.0003 3.4457 14.3318C3.07367 12.6633 3.18451 10.9234 3.76526 9.31561C4.346 7.70783 5.37263 6.29868 6.72501 5.25307C8.07739 4.20746 9.69959 3.56862 11.4018 3.41132C10.4052 4.75958 9.92564 6.42077 10.0503 8.09273C10.175 9.76469 10.8957 11.3364 12.0812 12.5219C13.2667 13.7075 14.8384 14.4281 16.5104 14.5528C18.1823 14.6775 19.8435 14.1979 21.1918 13.2013Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transition={{ duration }}
                    variants={moonVariants}
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
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        if (!("startViewTransition" in document)) {
            setTheme(nextTheme);
            // toast.info(
            //   `Theme : ${nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)} mode`
            // );
            return;
        }

        (document as any).startViewTransition(() => {
            setTheme(nextTheme);
            // toast.info(
            //   `Theme : ${nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)} mode`
            // );
        });
    };

    if (!mounted) {
        return (
            <Button
                variant="default"
                size="icon"
                className="w-9 h-9 cursor-pointer"
                aria-label="Toggle theme"
                disabled
            >
                <div className="w-5 h-5 bg-muted rounded" />
            </Button>
        );
    }

    return (
        <Button
            variant="default"
            size={"icon"}
            aria-label="Toggle Dark Mode"
            type="button"
            className="w-9 h-9 cursor-pointer"
            onClick={toggleTheme}
        >
            <SolarSwitch isDark={theme === "dark"} />
            {/*  using solor switch now */}
            {/* {theme === "light" ? (
        <svg
          className="h-9 w-9"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 10V2" />
          <path d="m4.93 10.93 1.41 1.41" />
          <path d="M2 18h2" />
          <path d="M20 18h2" />
          <path d="m19.07 10.93-1.41 1.41" />
          <path d="M22 22H2" />
          <path d="m16 6-4 4-4-4" />
          <path d="M16 18a4 4 0 0 0-8 0" />
        </svg>
      ) : (
        <svg
          className="h-9 w-9"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v8" />
          <path d="m4.93 10.93 1.41 1.41" />
          <path d="M2 18h2" />
          <path d="M20 18h2" />
          <path d="m19.07 10.93-1.41 1.41" />
          <path d="M22 22H2" />
          <path d="m8 6 4-4 4 4" />
          <path d="M16 18a4 4 0 0 0-8 0" />
        </svg>
      )} */}
        </Button>
    );
};

export default ThemeToggle;