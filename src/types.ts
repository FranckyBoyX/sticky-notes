export interface Note {
	id: string; // crypto.randomUUID()
	x: number; // px from canvas left
	y: number; // px from canvas top
	width: number; // px
	height: number; // px
	text: string;
	zIndex: number;
}

export type NoteAction =
	| { type: "CREATE"; payload: Omit<Note, "id" | "zIndex"> }
	| { type: "MOVE"; id: string; x: number; y: number }
	| { type: "RESIZE"; id: string; width: number; height: number }
	| { type: "REMOVE"; id: string }
	| { type: "UPDATE_TEXT"; id: string; text: string }
	| { type: "BRING_TO_FRONT"; id: string };
