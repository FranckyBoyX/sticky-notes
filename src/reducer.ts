import type { Note, NoteAction } from "./types";

export function notesReducer(state: Note[], action: NoteAction): Note[] {
	switch (action.type) {
		case "CREATE": {
			const maxZ = Math.max(0, ...state.map((n) => n.zIndex));
			const newNote: Note = {
				id: crypto.randomUUID(),
				zIndex: maxZ + 1,
				...action.payload,
			};
			return [...state, newNote];
		}

		case "MOVE":
			return state.map((n) =>
				n.id === action.id ? { ...n, x: action.x, y: action.y } : n,
			);

		case "RESIZE":
			return state.map((n) =>
				n.id === action.id
					? {
							...n,
							width: Math.max(100, action.width),
							height: Math.max(80, action.height),
						}
					: n,
			);

		case "REMOVE":
			return state.filter((n) => n.id !== action.id);

		case "UPDATE_TEXT":
			return state.map((n) =>
				n.id === action.id ? { ...n, text: action.text } : n,
			);

		case "BRING_TO_FRONT": {
			const maxZ = Math.max(0, ...state.map((n) => n.zIndex));
			return state.map((n) =>
				n.id === action.id ? { ...n, zIndex: maxZ + 1 } : n,
			);
		}
	}
}
