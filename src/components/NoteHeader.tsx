import type React from "react";
import { useDrag } from "../hooks/useDrag";
import type { NoteAction } from "../types";

interface NoteHeaderProps {
	noteId: string;
	noteX: number;
	noteY: number;
	dispatch: React.Dispatch<NoteAction>;
	trashZoneRef: React.RefObject<HTMLDivElement | null>;
	onDragStart: () => void;
	onDragEnd: () => void;
}

export function NoteHeader({
	noteId,
	noteX,
	noteY,
	dispatch,
	trashZoneRef,
	onDragStart,
	onDragEnd,
}: NoteHeaderProps) {
	const { startDrag } = useDrag({
		onMove: (dx, dy) => {
			const x = Math.max(0, Math.min(noteX + dx, window.innerWidth - 100));
			const y = Math.max(0, noteY + dy);
			dispatch({ type: "MOVE", id: noteId, x, y });
		},
		onRelease: (x, y) => {
			const trashEl = trashZoneRef.current;
			if (trashEl !== null) {
				const rect = trashEl.getBoundingClientRect();
				if (
					x >= rect.left &&
					x <= rect.right &&
					y >= rect.top &&
					y <= rect.bottom
				) {
					dispatch({ type: "REMOVE", id: noteId });
				}
			}
			onDragEnd();
		},
	});

	const handlePointerDown = (e: React.PointerEvent) => {
		dispatch({ type: "BRING_TO_FRONT", id: noteId });
		onDragStart();
		startDrag(e);
	};

	return (
		<div
			onPointerDown={handlePointerDown}
			style={{
				height: 24,
				background: "rgba(0,0,0,0.12)",
				cursor: "grab",
				borderRadius: "4px 4px 0 0",
				flexShrink: 0,
				display: "flex",
				alignItems: "center",
				paddingLeft: 8,
				userSelect: "none",
			}}
		>
			<span style={{ fontSize: 11, opacity: 0.6 }}>☰</span>
		</div>
	);
}
