import { cn } from '@/lib/shadcn/utils';
import { FC, PropsWithChildren } from 'react';

export const Heading1: FC<PropsWithChildren<{ className?: string }>> = ({
	children,
	className,
}) => {
	return (
		<h1
			className={cn(
				'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
				className
			)}
		>
			{children}
		</h1>
	);
};

export const Heading2: FC<PropsWithChildren<{ className?: string }>> = ({
	children,
	className,
}) => {
	return (
		<h2
			className={cn(
				'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0',
				className
			)}
		>
			{children}
		</h2>
	);
};

export const Heading3: FC<PropsWithChildren<{ className?: string }>> = ({
	children,
	className,
}) => {
	return (
		<h3
			className={cn(
				'scroll-m-20 text-2xl font-semibold tracking-tight',
				className
			)}
		>
			{children}
		</h3>
	);
};

export const Heading4: FC<PropsWithChildren<{ className?: string }>> = ({
	children,
	className,
}) => {
	return (
		<h4
			className={cn(
				'scroll-m-20 text-xl font-semibold tracking-tight',
				className
			)}
		>
			{children}
		</h4>
	);
};

export const Body: FC<PropsWithChildren<{ className?: string }>> = ({
	children,
	className,
}) => {
	return (
		<p className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}>
			{children}
		</p>
	);
};

export const Blockquote: FC<PropsWithChildren<{ className?: string }>> = ({
	children,
	className,
}) => {
	return (
		<blockquote className={cn('mt-6 border-l-2 pl-6 italic', className)}>
			{children}
		</blockquote>
	);
};

export const BodyLarge: FC<PropsWithChildren<{ className?: string }>> = ({
	children,
	className,
}) => {
	return (
		<div className={cn('text-lg font-semibold', className)}>{children}</div>
	);
};

export const Lead: FC<PropsWithChildren<{ className?: string }>> = ({
	children,
	className,
}) => {
	return (
		<p className={cn('text-xl text-muted-foreground', className)}>{children}</p>
	);
};

export const BodySmall: FC<PropsWithChildren<{ className?: string }>> = ({
	children,
	className,
}) => {
	return (
		<small className={cn('text-sm font-medium leading-none', className)}>
			{children}
		</small>
	);
};

export const BodyMuted: FC<PropsWithChildren<{ className?: string }>> = ({
	children,
	className,
}) => {
	return (
		<p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
	);
};
