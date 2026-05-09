import type React from "react";
import type { NoteAction } from "../types";

interface NoteBodyProps {
	noteId: string;
	text: string;
	dispatch: React.Dispatch<NoteAction>;
}

export function NoteBody({ noteId, text, dispatch }: NoteBodyProps) {
	const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
		const newText = e.currentTarget.textContent ?? "";
		dispatch({ type: "UPDATE_TEXT", id: noteId, text: newText });
	};

	const handlePointerDown = (e: React.PointerEvent) => {
		e.stopPropagation();
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: contentEditable provides the interactive semantics; this is a deliberate rich-text editor pattern
		<div
			contentEditable
			suppressContentEditableWarning
			onBlur={handleBlur}
			onPointerDown={handlePointerDown}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: note text is user-entered content, not external untrusted HTML
			dangerouslySetInnerHTML={{ __html: text }}
			style={{
				flex: 1,
				padding: "6px 8px",
				outline: "none",
				wordBreak: "break-word",
				overflowY: "auto",
				cursor: "text",
				fontSize: 14,
				lineHeight: 1.4,
			}}
		/>
	);
}
