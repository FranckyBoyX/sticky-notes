import type React from "react";
import { useRef, useState } from "react";
import { useDrag } from "../hooks/useDrag";
import type { NoteAction } from "../types";

interface NotepadStackProps {
	dispatch: React.Dispatch<NoteAction>;
	trashZoneRef: React.RefObject<HTMLDivElement | null>;
	onDragStart: () => void;
	onDragEnd: () => void;
}

export function NotepadStack({
	dispatch,
	trashZoneRef,
	onDragStart,
	onDragEnd,
}: NotepadStackProps) {
	const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(
		null,
	);
	const dragStartPos = useRef<{ x: number; y: number } | null>(null);
	const stackRef = useRef<HTMLDivElement>(null);

	const { startDrag, isDragging } = useDrag({
		onMove: (dx, dy) => {
			if (dragStartPos.current === null) return;
			setGhostPos({
				x: dragStartPos.current.x + dx - 100,
				y: dragStartPos.current.y + dy - 75,
			});
		},
		onRelease: (x, y) => {
			onDragEnd();

			// Check if released over trash zone
			const trashEl = trashZoneRef.current;
			if (trashEl) {
				const trashRect = trashEl.getBoundingClientRect();
				if (
					x >= trashRect.left &&
					x <= trashRect.right &&
					y >= trashRect.top &&
					y <= trashRect.bottom
				) {
					setGhostPos(null);
					dragStartPos.current = null;
					return;
				}
			}

			// Check if released back on the stack
			const stackEl = stackRef.current;
			if (stackEl) {
				const stackRect = stackEl.getBoundingClientRect();
				if (
					x >= stackRect.left &&
					x <= stackRect.right &&
					y >= stackRect.top &&
					y <= stackRect.bottom
				) {
					setGhostPos(null);
					dragStartPos.current = null;
					return;
				}
			}

			// Create note centered on cursor
			dispatch({
				type: "CREATE",
				payload: {
					x: x - 100,
					y: y - 75,
					width: 200,
					height: 150,
					text: "",
				},
			});

			setGhostPos(null);
			dragStartPos.current = null;
		},
	});

	const handlePointerDown = (e: React.PointerEvent) => {
		dragStartPos.current = { x: e.clientX, y: e.clientY };
		onDragStart();
		startDrag(e);
	};

	return (
		<>
			<div
				ref={stackRef}
				onPointerDown={handlePointerDown}
				style={{
					position: "fixed",
					top: 24,
					left: 24,
					width: 200,
					height: 150,
					cursor: "grab",
					zIndex: 10000,
					userSelect: "none",
				}}
			>
				{/* Stacked card effect — back cards first */}
				<div
					style={{
						position: "absolute",
						top: 8,
						left: 8,
						width: 200,
						height: 150,
						background: "#fff176",
						borderRadius: 4,
						boxShadow: "2px 2px 6px rgba(0,0,0,0.15)",
					}}
				/>
				<div
					style={{
						position: "absolute",
						top: 4,
						left: 4,
						width: 200,
						height: 150,
						background: "#fff59d",
						borderRadius: 4,
						boxShadow: "2px 2px 6px rgba(0,0,0,0.15)",
					}}
				/>
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: 200,
						height: 150,
						background: "#fff9c4",
						borderRadius: 4,
						boxShadow: "2px 2px 8px rgba(0,0,0,0.18)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: 13,
						color: "#bbb",
						fontFamily: "sans-serif",
					}}
				>
					Drag to create note
				</div>
			</div>

			{/* Ghost note rendered fixed so it floats above everything */}
			{isDragging && ghostPos !== null && (
				<div
					style={{
						position: "fixed",
						left: ghostPos.x,
						top: ghostPos.y,
						width: 200,
						height: 150,
						background: "#fff9c4",
						borderRadius: 4,
						boxShadow: "2px 2px 8px rgba(0,0,0,0.18)",
						opacity: 0.7,
						pointerEvents: "none",
						zIndex: 10001,
					}}
				/>
			)}
		</>
	);
}
