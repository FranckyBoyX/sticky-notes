import type React from "react";
import { useResize } from "../hooks/useResize";
import type { NoteAction } from "../types";
import styles from "./ResizeHandle.module.css";

interface ResizeHandleProps {
	noteId: string;
	width: number;
	height: number;
	dispatch: React.Dispatch<NoteAction>;
}

export function ResizeHandle({
	noteId,
	width,
	height,
	dispatch,
}: ResizeHandleProps) {
	const { startResize } = useResize({
		initialWidth: width,
		initialHeight: height,
		onResize: (w, h) =>
			dispatch({ type: "RESIZE", id: noteId, width: w, height: h }),
	});

	const handlePointerDown = (e: React.PointerEvent) => {
		e.stopPropagation();
		startResize(e);
	};

	return (
		<div className={styles.handle} onPointerDown={handlePointerDown}>
			<div className={styles.triangle} />
		</div>
	);
}
