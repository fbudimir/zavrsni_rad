import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/lib/shadcn/ui/dropdown-menu';
import { Input } from '@/lib/shadcn/ui/input';
import { ScrollArea } from '@/lib/shadcn/ui/scroll-area';
import { cn } from '@/lib/shadcn/utils';
import React, { FC, PropsWithChildren, useState } from 'react';

const UnitCard: FC<
	PropsWithChildren<{ border: boolean; selected?: boolean }>
> = ({ border = false, selected = false, children }) => {
	return (
		<div
			className={cn(
				'py-4 px-4 cursor-pointer',
				!border && 'border-b',
				selected && '',
				!selected && 'hover:bg-gray-50'
			)}
		>
			{children}
		</div>
	);
};

type StringKeys<T> = {
	[K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

const compareLists = (a: any[], b: any[]) => {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
};

export const RichSelector = <T extends {}>({
	data,
	identifier,
	displayKey,
	multiselect = false,
	row,
	filter = (row, search) => (row[identifier] as string).includes(search),
	onChange = (rows: string[]) => {},
	selectedIds,
	placeholder = '',
}: {
	data: T[];
	identifier: keyof T;
	displayKey?: keyof T;
	multiselect?: boolean;
	row: (row: T) => React.ReactNode;
	filter?: (row: T, search: string) => boolean;
	onChange?: (selectedIds: string[]) => void;
	selectedIds: string[];
	placeholder?: string;
}) => {
	const [search, setSearch] = useState('');

	const selectedDisplay = selectedIds.map((id) => {
		const row = data.find((unit) => unit[identifier] === id);
		if (row) {
			return row[displayKey || identifier];
		} else {
			return '?';
		}
	});

	const filteredRows = data.filter((unit) => filter(unit, search));

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Input
						className="italic"
						type="text"
						readOnly
						value={selectedDisplay.join(', ')}
						placeholder={placeholder}
					/>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<div className="w-72 flex flex-col gap-2">
						<Input
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search..."
						/>
						<ScrollArea className="h-72 w-full rounded-md">
							{filteredRows.map((unit, i) => (
								<div
									key={i}
									className={cn(
										'py-4 px-4 cursor-pointer rounded-md',
										selectedIds.includes(unit[identifier] as string)
											? 'bg-blue-100 hover:bg-blue-200'
											: 'hover:bg-muted'
									)}
									onClick={() => {
										if (multiselect) {
											if (selectedIds.includes(unit[identifier] as string)) {
												onChange(
													selectedIds.filter((id) => id !== unit[identifier])
												);
											} else {
												onChange([...selectedIds, unit[identifier] as string]);
											}
										} else {
											if (selectedIds.includes(unit[identifier] as string)) {
												onChange([]);
											} else {
												onChange([unit[identifier] as string]);
											}
										}
									}}
								>
									{row(unit)}
								</div>
							))}
						</ScrollArea>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
