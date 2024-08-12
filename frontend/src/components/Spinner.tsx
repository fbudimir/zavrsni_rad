import { cn } from '@/lib/shadcn/utils';

export const Spinner = ({
	white,
	className,
}: {
	className?: string;
	white?: boolean;
}) => {
	return (
		<span
			className={cn(
				`inline-block h-4 w-4 animate-spin rounded-full border-b-2 border-r-2`,
				white ? 'border-neutral-200' : 'border-neutral-500',
				className
			)}
		/>
	);
};
