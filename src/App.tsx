import { useEffect, useRef, useState } from "react";
import { Canvas } from "./components/Canvas";
import { NotepadStack } from "./components/NotepadStack";
import { TrashZone } from "./components/TrashZone";
import { usePersistedReducer } from "./hooks/usePersistedReducer";
import { notesReducer } from "./reducer";
import type { Note } from "./types";

export default function App() {
	const [notes, dispatch] = usePersistedReducer<
		Note[],
		Parameters<typeof notesReducer>[1]
	>(notesReducer, "sticky-notes", []);
	const trashZoneRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	const handleDragStart = () => setIsDragging(true);
	const handleDragEnd = () => setIsDragging(false);

	useEffect(() => {
		document.body.style.userSelect = isDragging ? "none" : "";
	}, [isDragging]);

	return (
		<>
			<NotepadStack
				dispatch={dispatch}
				trashZoneRef={trashZoneRef}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			/>
			<Canvas
				notes={notes}
				dispatch={dispatch}
				trashZoneRef={trashZoneRef}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			/>
			<TrashZone isActive={isDragging} trashZoneRef={trashZoneRef} />
		</>
	);
}
