import type React from "react";
import { useRef } from "react";
import { useDrag } from "../hooks/useDrag";
import styles from "../styles/NoteHeader.module.css";
import type { NoteAction } from "../types";

interface NoteHeaderProps {
	noteId: string;
	noteX: number;
	noteY: number;
	noteWidth: number;
	noteHeight: number;
	dispatch: React.Dispatch<NoteAction>;
	trashZoneRef: React.RefObject<HTMLDivElement | null>;
	onDragStart: () => void;
	onDragEnd: () => void;
}

export function NoteHeader({
	noteId,
	noteX,
	noteY,
	noteWidth,
	noteHeight,
	dispatch,
	trashZoneRef,
	onDragStart,
	onDragEnd,
}: NoteHeaderProps) {
	// Capture note position at drag start. useDrag gives cumulative deltas from
	// pointerdown, so we must add them to the position at drag start — not the
	// live prop, which updates on every MOVE dispatch and would cause drift.
	const dragStartPos = useRef({ x: 0, y: 0 });

	const { startDrag } = useDrag({
		onMove: (dx, dy) => {
			const x = Math.max(
				0,
				Math.min(dragStartPos.current.x + dx, window.innerWidth - noteWidth),
			);
			const y = Math.max(
				0,
				Math.min(dragStartPos.current.y + dy, window.innerHeight - noteHeight),
			);
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
		dragStartPos.current = { x: noteX, y: noteY };
		dispatch({ type: "BRING_TO_FRONT", id: noteId });
		onDragStart();
		startDrag(e);
	};

	return (
		<div className={styles.header} onPointerDown={handlePointerDown}>
			<span className={styles.icon}>☰</span>
		</div>
	);
}
