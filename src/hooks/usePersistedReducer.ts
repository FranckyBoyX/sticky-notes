import { type Dispatch, useEffect, useReducer } from "react";

export function usePersistedReducer<S, A>(
	reducer: (state: S, action: A) => S,
	key: string,
	initialState: S,
): [S, Dispatch<A>] {
	const [state, dispatch] = useReducer(reducer, undefined, () => {
		try {
			const stored = localStorage.getItem(key);
			return stored ? (JSON.parse(stored) as S) : initialState;
		} catch {
			return initialState;
		}
	});

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(state));
	}, [key, state]);

	return [state, dispatch];
}
