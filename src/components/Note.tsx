import type React from "react";
import styles from "../styles/Note.module.css";
import type { NoteAction, Note as NoteType } from "../types";
import { NoteBody } from "./NoteBody";
import { NoteHeader } from "./NoteHeader";
import { ResizeHandle } from "./ResizeHandle";

interface NoteProps {
	note: NoteType;
	dispatch: React.Dispatch<NoteAction>;
	trashZoneRef: React.RefObject<HTMLDivElement | null>;
	onDragStart: () => void;
	onDragEnd: () => void;
}

export function Note({
	note,
	dispatch,
	trashZoneRef,
	onDragStart,
	onDragEnd,
}: NoteProps) {
	return (
		<div
			className={styles.note}
			style={{
				left: note.x,
				top: note.y,
				width: note.width,
				height: note.height,
				zIndex: note.zIndex,
			}}
		>
			<NoteHeader
				noteId={note.id}
				noteX={note.x}
				noteY={note.y}
				noteWidth={note.width}
				noteHeight={note.height}
				dispatch={dispatch}
				trashZoneRef={trashZoneRef}
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
			/>
			<NoteBody noteId={note.id} text={note.text} dispatch={dispatch} />
			<ResizeHandle
				noteId={note.id}
				width={note.width}
				height={note.height}
				dispatch={dispatch}
			/>
		</div>
	);
}
