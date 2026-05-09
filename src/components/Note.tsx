import type React from "react";
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
			style={{
				position: "absolute",
				left: note.x,
				top: note.y,
				width: note.width,
				height: note.height,
				zIndex: note.zIndex,
				background: "#fff9c4",
				borderRadius: 4,
				boxShadow: "2px 2px 8px rgba(0,0,0,0.18)",
				display: "flex",
				flexDirection: "column",
				boxSizing: "border-box",
			}}
		>
			<NoteHeader
				noteId={note.id}
				noteX={note.x}
				noteY={note.y}
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
