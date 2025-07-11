import type { ItemDefinition, RowDefinition } from "dnd-timeline";
import { groupItemsToSubrows, useTimelineContext } from "dnd-timeline";
import React, { useMemo } from "react";
import Item from "./Item";
import Row from "./Row";
import Sidebar from "./Sidebar";
import Subrow from "./Subrow";
import type { FileInfo } from "./utils";

interface EnhancedItemDefinition extends ItemDefinition {
  fileInfo?: FileInfo;
}

interface TimelineProps {
	rows: RowDefinition[];
	items: EnhancedItemDefinition[];

}

function Timeline(props: TimelineProps) {
	const { setTimelineRef, style, range } = useTimelineContext();

	const groupedSubrows = useMemo(
		() => groupItemsToSubrows(props.items, range),
		[props.items, range],
	);

	const renderItem = (item: EnhancedItemDefinition) => {
	}
	

	return (
		<div ref={setTimelineRef} style={style}>
			{props.rows.map((row) => (
				<Row id={row.id} key={row.id} sidebar={<Sidebar row={row} />}>
					{groupedSubrows[row.id]?.map((subrow, index) => (
						<Subrow key={`${row.id}-${index}`}>
							{subrow.map((item) => (
								<Item id={item.id} key={item.id} span={item.span}>
									{`Item ${item.fileInfo ? item.fileInfo.name: item.id}`}
								</Item>
							))}
						</Subrow>
					))}
				</Row>
			))}
		</div>
	);
}

export default Timeline;
