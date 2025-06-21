import type { RowDefinition } from "dnd-timeline";
/*
 * Sidebar.tsx
 - サイドバーのデザインを定義するコンポーネント
 */
interface SidebarProps {
	row: RowDefinition;
}

function Sidebar(props: SidebarProps) {
	return (
		<div
			style={{ width: 300, border: "1px solid grey" }}
		>{`Row ${props.row.id}`}</div>
	);
}

export default Sidebar;
