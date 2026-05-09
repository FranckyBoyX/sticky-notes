import { useCallback, useEffect, useRef, useState } from "react";

interface UseDragOptions {
	onMove: (dx: number, dy: number) => void;
	onRelease: (x: number, y: number) => void;
}

interface UseDragResult {
	startDrag: (e: React.PointerEvent) => void;
	isDragging: boolean;
}

export function useDrag(options: UseDragOptions): UseDragResult {
	const [isDragging, setIsDragging] = useState(false);

	// Use refs for start position and options to avoid stale closures in window listeners
	const startPos = useRef<{ x: number; y: number } | null>(null);
	const optionsRef = useRef(options);
	optionsRef.current = options;

	const startDrag = useCallback((e: React.PointerEvent) => {
		// Capture the pointer so movement stays smooth even when cursor leaves the element
		(e.currentTarget as Element).setPointerCapture(e.pointerId);

		startPos.current = { x: e.clientX, y: e.clientY };
		setIsDragging(true);
	}, []);

	useEffect(() => {
		if (!isDragging) return;

		const handleMove = (e: PointerEvent) => {
			const start = startPos.current;
			if (start === null) return;
			optionsRef.current.onMove(e.clientX - start.x, e.clientY - start.y);
		};

		const handleUp = (e: PointerEvent) => {
			optionsRef.current.onRelease(e.clientX, e.clientY);
			startPos.current = null;
			setIsDragging(false);
		};

		window.addEventListener("pointermove", handleMove);
		window.addEventListener("pointerup", handleUp);

		return () => {
			window.removeEventListener("pointermove", handleMove);
			window.removeEventListener("pointerup", handleUp);
		};
	}, [isDragging]);

	return { startDrag, isDragging };
}
