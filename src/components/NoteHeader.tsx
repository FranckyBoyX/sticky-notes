import type React from "react";
import { useDrag } from "../hooks/useDrag";
import styles from "../styles/NoteHeader.module.css";
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
		<div className={styles.header} onPointerDown={handlePointerDown}>
			<span className={styles.icon}>☰</span>
		</div>
	);
}
