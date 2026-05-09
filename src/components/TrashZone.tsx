import type React from "react";
import styles from "./TrashZone.module.css";

interface TrashZoneProps {
	isActive: boolean;
	trashZoneRef: React.RefObject<HTMLDivElement | null>;
}

export function TrashZone({ isActive, trashZoneRef }: TrashZoneProps) {
	return (
		<div
			ref={trashZoneRef}
			className={`${styles.zone} ${isActive ? styles.active : styles.inactive}`}
		>
			🗑
		</div>
	);
}
