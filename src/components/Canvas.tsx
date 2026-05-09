import type React from "react";
import styles from "../styles/Canvas.module.css";
import type { NoteAction, Note as NoteType } from "../types";
import { Note } from "./Note";

interface CanvasProps {
	notes: NoteType[];
	dispatch: React.Dispatch<NoteAction>;
	trashZoneRef: React.RefObject<HTMLDivElement | null>;
	onDragStart: () => void;
	onDragEnd: () => void;
}

export function Canvas({
	notes,
	dispatch,
	trashZoneRef,
	onDragStart,
	onDragEnd,
}: CanvasProps) {
	const sortedNotes = [...notes].sort((a, b) => a.zIndex - b.zIndex);

	return (
		<div className={styles.canvas}>
			{sortedNotes.map((note) => (
				<Note
					key={note.id}
					note={note}
					dispatch={dispatch}
					trashZoneRef={trashZoneRef}
					onDragStart={onDragStart}
					onDragEnd={onDragEnd}
				/>
			))}
		</div>
	);
}
