import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/lib/shadcn/ui/breadcrumb';
import { FC, Fragment } from 'react';

type BreadcrumbType = {
	title: string;
	href: string;
};

export const Breadcrumbs: FC<{ links: BreadcrumbType[] }> = ({ links }) => {
	return (
		<Breadcrumb className="mb-10">
			<BreadcrumbList>
				{links.map(({ title, href }, i) => (
					<Fragment key={i}>
						{i !== links.length - 1 && (
							<BreadcrumbItem>
								<BreadcrumbLink href={href}>{title}</BreadcrumbLink>
							</BreadcrumbItem>
						)}
						{i !== links.length - 1 && <BreadcrumbSeparator />}
						{i === links.length - 1 && (
							<BreadcrumbItem>
								<BreadcrumbPage>{title}</BreadcrumbPage>
							</BreadcrumbItem>
						)}
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
};
