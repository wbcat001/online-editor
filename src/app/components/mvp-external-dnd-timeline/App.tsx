import "./index.css";
import { endOfDay, startOfDay } from "date-fns";
import type { DragEndEvent, Range, ResizeEndEvent } from "dnd-timeline";
import { TimelineContext } from "dnd-timeline";
import React, { useCallback, useState } from "react";
import ExternalList from "./ExternalList";
import Timeline from "./Timeline";
import {
	ItemType,
	generateExternalItems,
	generateItems,
	generateRows,
	processFile,
	createExternalItemFromFile,
} from "./utils";
import type { FileInfo } from "./utils";
import type { ItemDefinition } from "dnd-timeline";
import type { ExternalItemDefinition } from "./ExternalItem";
import FileDropZone from "./FileDropZone";

interface EnhancedItemDefinition extends ItemDefinition {
  fileInfo?: FileInfo;
}

const DEFAULT_RANGE: Range = {
	start: startOfDay(new Date()).getTime(),
	end: endOfDay(new Date()).getTime(),
};

function App() {
	const [range, setRange] = useState(DEFAULT_RANGE);

	const [rows] = useState(generateRows(5));
	const [items, setItems] = useState<EnhancedItemDefinition[]>(generateItems(10, range, rows));
	const [externalItems, setExternalItems] = useState<ExternalItemDefinition[]>(
		generateExternalItems(10, range, rows),
	);

	// ファイル管理
	const handleFileAccepted = useCallback(async (files: File[]) => {
		const processedFiles = await Promise.all(files.map(processFile));
		const newExternalItems = processedFiles.map((file) => createExternalItemFromFile(file, rows));

		setExternalItems((prev) => [...prev, ...newExternalItems]);
	}, []);

	const onResizeEnd = useCallback((event: ResizeEndEvent) => {
		const updatedSpan =
			event.active.data.current.getSpanFromResizeEvent?.(event);

		if (!updatedSpan) return;

		const activeItemId = event.active.id;
		



		setItems((prev) =>
			prev.map((item) => {
				if (item.id !== activeItemId) return item;

				return {
					...item,
					span: updatedSpan,
				};
			}),
		);
	}, []);

	const onDragEnd = useCallback((event: DragEndEvent) => {
		const activeRowId = event.over?.id as string;
		const updatedSpan = event.active.data.current.getSpanFromDragEvent?.(event);

		if (!updatedSpan || !activeRowId) return;

		const activeItemId = event.active.id.toString();
		const activeItemType = event.active.data.current?.type as ItemType;
		const fileInfo = event.active.data.current?.fileInfo as FileInfo | undefined;

		if (activeItemType === ItemType.ListItem) {
			setItems((prev) =>
				prev.map((item) => {
					if (item.id !== activeItemId) return item;

					return {
						...item,
						rowId: activeRowId,
						span: updatedSpan,
					};
				}),
			);
		} else if (activeItemType === ItemType.ExternalItem) {
			setItems((prev) => [
				...prev,
				{
					id: activeItemId,
					rowId: activeRowId,
					span: updatedSpan,
					fileInfo,
				},
			]);
			setExternalItems((prev) =>
				prev.filter((item) => item.id !== activeItemId),
			);
		}
	}, []);

	return (
		<TimelineContext
			range={range}
			onDragEnd={onDragEnd}
			onResizeEnd={onResizeEnd}
			onRangeChanged={setRange}
		>
			
			<Timeline items={items} rows={rows} />
			<FileDropZone onFileAccepted={handleFileAccepted} />
			<ExternalList items={externalItems} />
		</TimelineContext>
	);
}

export default App;
