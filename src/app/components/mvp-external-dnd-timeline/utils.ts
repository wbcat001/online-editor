import { differenceInMilliseconds, minutesToMilliseconds } from "date-fns";
import type { ItemDefinition, Range, RowDefinition, Span } from "dnd-timeline";
import { nanoid } from "nanoid";
import type { ExternalItemDefinition } from "./ExternalItem";

export interface FileInfo {
	id: string;
	name: string;
	type: string;
	size: number;
	duration?: number; // ミリ秒単位の動画の長さ
	thumnail?: string; // サムネイル画像のURL
}

export const processFile = async (file: File): Promise<FileInfo> => {
	const id = nanoid(4);
	let duration: number | undefined;
	let thumnail: string | undefined;

	if (file.type.startsWith("image/"
	) || file.type.startsWith("video/")) {
		thumnail = await generateThumbnail(file);
	}

	if (file.type.startsWith("audio/") || file.type.startsWith("video/")) {
		duration = await getMediaDuration(file);
	}

	return {
		id,
		name: file.name,
		type: file.type,
		size: file.size,
		duration,
		thumnail,
	};
};

// 音声/動画ファイルの長さを取得
const getMediaDuration = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const element = file.type.startsWith('audio/') 
      ? document.createElement('audio')
      : document.createElement('video');
    
    element.preload = 'metadata';
    
    element.onloadedmetadata = () => {
      window.URL.revokeObjectURL(element.src);
      resolve(element.duration * 1000); // ミリ秒単位に変換
    };
    
    element.src = URL.createObjectURL(file);
  });
};

// サムネイル生成（画像/動画）
const generateThumbnail = async (file: File): Promise<string> => {
  if (file.type.startsWith('image/')) {
    return URL.createObjectURL(file);
  } else if (file.type.startsWith('video/')) {
    // ビデオのサムネイル生成はより複雑なため、ここではURLのみ返す
    // 実際の実装ではcanvasなどを使ってフレームを取得する
    return URL.createObjectURL(file);
  }
  return '';
};

// FileInfoからExternalItemDefinitionを生成する関数
export const createExternalItemFromFile = (
	fileInfo: FileInfo,
	rows: RowDefinition[],
): ExternalItemDefinition => {
	const defaultDuration = 60000; // デフォルトは1分
	const row = rows[Math.ceil(Math.random() * rows.length - 1)];
	const rowId = row.id;
	// const disabled = row.disabled || options?.disabled;
  
  return {
    id: fileInfo.id,
	rowId,
    duration: fileInfo.duration || defaultDuration,
    fileInfo // 追加情報としてFileInfoを保存
  };
};

interface GenerateRowsOptions {
	disabled?: boolean;
}

export const generateRows = (count: number, options?: GenerateRowsOptions) => {
	return Array(count)
		.fill(0)
		.map((): RowDefinition => {
			const disabled = options?.disabled;

			let id = `row-${nanoid(4)}`;
			if (disabled) id += " (disabled)";

			return {
				id,
				disabled,
			};
		});
};

const getRandomInRange = (min: number, max: number) => {
	return Math.random() * (max - min) + min;
};

const DEFAULT_MIN_DURATION = minutesToMilliseconds(60);
const DEFAULT_MAX_DURATION = minutesToMilliseconds(360);

export const generateRandomSpan = (
	range: Range,
	minDuration: number = DEFAULT_MIN_DURATION,
	maxDuration: number = DEFAULT_MAX_DURATION,
): Span => {
	const duration = getRandomInRange(minDuration, maxDuration);

	const start = getRandomInRange(range.start, range.end - duration);

	const end = start + duration;

	return {
		start: start,
		end: end,
	};
};

interface GenerateItemsOptions {
	disabled?: boolean;
	background?: boolean;
	minDuration?: number;
	maxDuration?: number;
}

export const generateItems = (
	count: number,
	range: Range,
	rows: RowDefinition[],
	options?: GenerateItemsOptions,
) => {
	return Array(count)
		.fill(0)
		.map((): ItemDefinition => {
			const row = rows[Math.ceil(Math.random() * rows.length - 1)];
			const rowId = row.id;
			const disabled = row.disabled || options?.disabled;

			const span = generateRandomSpan(
				range,
				options?.minDuration,
				options?.maxDuration,
			);

			let id = `item-${nanoid(4)}`;
			if (disabled) id += " (disabled)";

			return {
				id,
				rowId,
				span,
				disabled,
			};
		});
};

export enum ItemType {
	ListItem = 0,
	ExternalItem = 1,
}

export const generateExternalItems = (
	count: number,
	range: Range,
	rows: RowDefinition[],
	options?: GenerateItemsOptions,
) => {
	return Array(count)
		.fill(0)
		.map((): ExternalItemDefinition => {
			const row = rows[Math.ceil(Math.random() * rows.length - 1)];
			const rowId = row.id;
			const disabled = row.disabled || options?.disabled;

			const span = generateRandomSpan(
				range,
				options?.minDuration,
				options?.maxDuration,
			);

			const duration = differenceInMilliseconds(span.end, span.start);

			let id = `item-${nanoid(4)}`;
			if (disabled) id += " (disabled)";

			return {
				id,
				rowId,
				duration,
				disabled,
			};
		});
};
