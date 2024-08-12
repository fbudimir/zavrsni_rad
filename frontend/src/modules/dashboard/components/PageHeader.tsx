import { BodyLarge, Heading1 } from '@/components/Typography';
import { FC, PropsWithChildren } from 'react';

export const PageHeader: FC<PropsWithChildren<{}>> = ({ children }) => {
	return (
		<div className="w-full px-4 pt-10 pb-10 mb-10 flex flex-row justify-between border-b">
			{children}
		</div>
	);
};

export const PageHeaderContent: FC<PropsWithChildren<{}>> = ({ children }) => {
	return <div className="flex flex-col">{children}</div>;
};

export const PageHeaderTitle: FC<PropsWithChildren<{}>> = ({ children }) => {
	return <Heading1>{children}</Heading1>;
};

export const PageHeaderActions: FC<PropsWithChildren<{}>> = ({ children }) => {
	return (
		<div className="flex shrink-0 flex-row items-center gap-2">{children}</div>
	);
};

export const PageHeaderDescription: FC<PropsWithChildren<{}>> = ({
	children,
}) => {
	return <BodyLarge className="text-neutral-400">{children}</BodyLarge>;
};
