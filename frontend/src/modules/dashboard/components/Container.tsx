import { cn } from '@/lib/shadcn/utils';
import { FC, PropsWithChildren } from 'react';

export const Container: FC<PropsWithChildren<{ narrow?: boolean }>> = ({
	children,
	narrow,
}) => {
	return (
		<div
			className={cn(
				'w-full max-w-4xl mx-auto px-4 py-10',
				narrow ? 'max-w-[400px]' : 'max-w-4xl'
			)}
		>
			{children}
		</div>
	);
};
