"use client";
import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
export interface TextBlurInProps
    extends Omit<HTMLMotionProps<any>, "children"> {
    children: string;
    duration?: number;
    delay?: number;
    by?: "character" | "word";
    staggerDelay?: number;
    as?: any;
}
export function TextBlurIn({
    children,
    className,
    duration = 0.8,
    delay = 0,
    by = "word",
    staggerDelay = 0.04,
    as: Component = motion.p,
    ...props
}: TextBlurInProps) {
    const units = by === "word" ? children.split(" ") : children.split("");
    return (
        <Component className={cn(className)} {...props}>
            {units.map((unit, index) => (
                <React.Fragment key={index}>
                    <motion.span
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{
                            duration,
                            delay: delay + index * staggerDelay,
                        }}
                        style={{ display: "inline-block" }}
                    >
                        {unit}
                    </motion.span>
                    {by === "word" && index < units.length - 1 && " "}
                </React.Fragment>
            ))}
        </Component>
    );
}