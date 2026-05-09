import { useCallback, useEffect, useRef, useState } from "react";

interface UseResizeOptions {
	initialWidth: number;
	initialHeight: number;
	onResize: (width: number, height: number) => void;
}

interface UseResizeResult {
	startResize: (e: React.PointerEvent) => void;
	isResizing: boolean;
}

export function useResize(options: UseResizeOptions): UseResizeResult {
	const [isResizing, setIsResizing] = useState(false);

	// Use refs for start position and dimensions to avoid stale closures in window listeners
	const startPos = useRef<{ x: number; y: number } | null>(null);
	const startDims = useRef<{ width: number; height: number } | null>(null);
	const optionsRef = useRef(options);
	optionsRef.current = options;

	const startResize = useCallback((e: React.PointerEvent) => {
		// Capture the pointer so resizing stays smooth even when cursor leaves the element
		(e.target as Element).setPointerCapture(e.pointerId);

		startPos.current = { x: e.clientX, y: e.clientY };
		startDims.current = {
			width: optionsRef.current.initialWidth,
			height: optionsRef.current.initialHeight,
		};
		setIsResizing(true);
	}, []);

	useEffect(() => {
		if (!isResizing) return;

		const handleMove = (e: PointerEvent) => {
			const start = startPos.current;
			const dims = startDims.current;
			if (start === null || dims === null) return;

			const dx = e.clientX - start.x;
			const dy = e.clientY - start.y;
			optionsRef.current.onResize(dims.width + dx, dims.height + dy);
		};

		const handleUp = (e: PointerEvent) => {
			const start = startPos.current;
			const dims = startDims.current;
			if (start !== null && dims !== null) {
				const dx = e.clientX - start.x;
				const dy = e.clientY - start.y;
				optionsRef.current.onResize(dims.width + dx, dims.height + dy);
			}
			startPos.current = null;
			startDims.current = null;
			setIsResizing(false);
		};

		window.addEventListener("pointermove", handleMove);
		window.addEventListener("pointerup", handleUp);

		return () => {
			window.removeEventListener("pointermove", handleMove);
			window.removeEventListener("pointerup", handleUp);
		};
	}, [isResizing]);

	return { startResize, isResizing };
}
