import { BodyLarge, BodySmall } from '@/components/Typography';
import { Card, CardHeader } from '@/lib/shadcn/ui/card';
import { cn } from '@/lib/shadcn/utils';
import { ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

export const InfoCard: FC<{ label?: any; value?: any; href?: string }> = ({
	label,
	value,
	href,
}) => {
	const Content = () => (
		<Card
			className={cn('flex flex-col gap-1 border border-neutral-200 rounded-lg')}
			clickable={!!href}
		>
			<CardHeader>
				<BodySmall className="w-full">{label}</BodySmall>
				<div className="flex flex-row items-center justify-between">
					<BodyLarge>{value}</BodyLarge>
					{href && <ExternalLinkIcon />}
				</div>
			</CardHeader>
		</Card>
	);

	if (href) {
		return (
			<Link href={href}>
				<Content />
			</Link>
		);
	}

	return <Content />;
};
