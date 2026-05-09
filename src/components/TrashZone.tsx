import type React from "react";

interface TrashZoneProps {
	isActive: boolean;
	trashZoneRef: React.RefObject<HTMLDivElement | null>;
}

export function TrashZone({ isActive, trashZoneRef }: TrashZoneProps) {
	return (
		<div
			ref={trashZoneRef}
			style={{
				position: "fixed",
				bottom: 32,
				left: "50%",
				transform: "translateX(-50%)",
				width: 120,
				height: 64,
				borderRadius: 12,
				background: isActive ? "#ef5350" : "#bdbdbd",
				opacity: isActive ? 1 : 0,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontSize: 28,
				boxShadow: isActive ? "0 4px 16px rgba(0,0,0,0.3)" : "none",
				transition: "opacity 0.15s ease, background 0.15s ease",
				pointerEvents: "none",
				userSelect: "none",
				zIndex: 9999,
			}}
		>
			🗑
		</div>
	);
}
