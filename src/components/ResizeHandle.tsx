import type React from "react";
import { useResize } from "../hooks/useResize";
import type { NoteAction } from "../types";

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
		<div
			onPointerDown={handlePointerDown}
			style={{
				position: "absolute",
				bottom: 0,
				right: 0,
				width: 16,
				height: 16,
				cursor: "se-resize",
				background: "transparent",
				overflow: "hidden",
			}}
		>
			<div
				style={{
					width: 0,
					height: 0,
					borderStyle: "solid",
					borderWidth: "0 0 14px 14px",
					borderColor: "transparent transparent #666 transparent",
					position: "absolute",
					bottom: 1,
					right: 1,
				}}
			/>
		</div>
	);
}
