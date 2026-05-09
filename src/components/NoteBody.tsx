import type React from "react";
import { useEffect, useRef } from "react";
import type { NoteAction } from "../types";
import styles from "./NoteBody.module.css";

interface NoteBodyProps {
	noteId: string;
	text: string;
	dispatch: React.Dispatch<NoteAction>;
}

export function NoteBody({ noteId, text, dispatch }: NoteBodyProps) {
	const divRef = useRef<HTMLDivElement>(null);

	// Set initial content on mount only â€” do NOT sync on text prop changes
	// while the user may be editing. Read-back happens on blur.
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only effect â€” text is set once so the DOM isn't overwritten while the user types
	useEffect(() => {
		if (divRef.current) {
			divRef.current.textContent = text;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // intentional empty dep array â€” mount only

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
			ref={divRef}
			className={styles.body}
			contentEditable
			suppressContentEditableWarning
			onBlur={handleBlur}
			onPointerDown={handlePointerDown}
		/>
	);
}
