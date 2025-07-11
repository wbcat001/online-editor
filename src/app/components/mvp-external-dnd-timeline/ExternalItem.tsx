import { useDraggable } from "@dnd-kit/core";
import type { ItemDefinition } from "dnd-timeline";
import { useTimelineContext } from "dnd-timeline";
import type { FileInfo } from "./utils";
import { ItemType } from "./utils";

export interface ExternalItemDefinition extends Omit<ItemDefinition, "span"> {
	duration: number;
	fileInfo?: FileInfo;
}

interface ListItemProps {
	item: ExternalItemDefinition;
}

function ExternalItem(props: ListItemProps) {
	const { getSpanFromDragEvent, valueToPixels } = useTimelineContext();
	const { fileInfo } = props.item;

	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: props.item.id,
		data: {
			type: ItemType.ExternalItem,
			duration: props.item.duration,
			getSpanFromDragEvent,
			fileInfo,
		},
	});
	console.log("duration", props.item.duration);

	const style = {
		height: "50px",
		width: valueToPixels(props.item.duration),
		border: "1px solid white",
		...(transform && {
			transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
		}),
	};

	return (
		<div ref={setNodeRef} {...attributes} {...listeners} style={style}>
			{fileInfo?.name || props.item.id}
		</div>
	);
}

export default ExternalItem;
