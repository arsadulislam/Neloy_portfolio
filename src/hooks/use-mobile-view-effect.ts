"use client";

import { useEffect, useState, RefObject } from "react";
import { useInView } from "framer-motion";
export const VIEWPORT_MARGIN_PERCENT = 40;

export function useIsMobile() {
	const [isMobile, setIsMobile] = useState(() => {
		if (typeof window === "undefined") return false;
		return window.matchMedia("(max-width: 1024px)").matches;
	});

	useEffect(() => {
		const mediaQuery = window.matchMedia("(max-width: 1024px)");

		const handler = (event: MediaQueryListEvent) =>
			setIsMobile(event.matches);
		mediaQuery.addEventListener("change", handler);
		return () => mediaQuery.removeEventListener("change", handler);
	}, []);

	return isMobile;
}

export function useAutoHighlight(
	ref: RefObject<HTMLElement | null>,
	isMobile: boolean,
) {
	const isInView = useInView(ref, {
		margin: `-${VIEWPORT_MARGIN_PERCENT}% 0px -${VIEWPORT_MARGIN_PERCENT}% 0px`,
	});
	return isMobile && isInView;
}

export function useAtTopHighlight(isMobile: boolean, threshold = 20) {
	const [isAtTop, setIsAtTop] = useState(true);

	useEffect(() => {
		if (!isMobile) {
			setIsAtTop(false);
			return;
		}

		const handleScroll = (e: any) => {
			const target = e.target;
			// Extract scroll position from various possible targets (Window, Document, or Viewport Div)
			const scrollY = 
				target.scrollTop !== undefined ? target.scrollTop :
				target.pageYOffset !== undefined ? target.pageYOffset :
				(target === document ? (document.scrollingElement?.scrollTop || document.documentElement.scrollTop) : 0);
			
			// console.log(`[DEBUG] ScrollY: ${scrollY} (Threshold: ${threshold})`);
			setIsAtTop(scrollY < threshold);
		};

		// Initial check
		const initialScroll = window.scrollY || document.documentElement.scrollTop;
		setIsAtTop(initialScroll < threshold);

		// capture: true is essential for catching scroll events from child containers like Radix ScrollArea
		window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
		return () => window.removeEventListener("scroll", handleScroll, { capture: true });
	}, [isMobile, threshold]);

	return isAtTop;
}
export function useAtBottomHighlight(isMobile: boolean, threshold = 20) {
	const [isAtBottom, setIsAtBottom] = useState(false);

	useEffect(() => {
		if (!isMobile) {
			setIsAtBottom(false);
			return;
		}

		const handleScroll = (e: any) => {
			const target = e.target;
			if (!target) return;

			// Handle both Window/Document and specific Element targets
			const scrollHeight = target.scrollHeight || (target === document ? document.documentElement.scrollHeight : 0);
			const clientHeight = target.clientHeight || (target === document ? window.innerHeight : 0);
			const scrollTop = target.scrollTop !== undefined ? target.scrollTop : (target === document ? (window.scrollY || document.documentElement.scrollTop) : 0);

			const distanceToBottom = scrollHeight - (scrollTop + clientHeight);
			
			// console.log(`[DEBUG-BOTTOM] Distance: ${distanceToBottom} (Threshold: ${threshold})`);
			setIsAtBottom(distanceToBottom < threshold);
		};

		// capture: true is crucial for Radix overlays and other nested scroll containers
		window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
		return () => window.removeEventListener("scroll", handleScroll, { capture: true });
	}, [isMobile, threshold]);

	return isAtBottom;
}
