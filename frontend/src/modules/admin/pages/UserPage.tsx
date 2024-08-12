'use client';

import { Button } from '@/lib/shadcn/ui/button';
import { Breadcrumbs } from '@/modules/dashboard/components/Breadcrumbs';
import {
	PageHeader,
	PageHeaderActions,
	PageHeaderContent,
	PageHeaderDescription,
	PageHeaderTitle,
} from '@/modules/dashboard/components/PageHeader';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FC } from 'react';
import { UserDetails } from '../components/UserDetails';
import { useUser } from '../hooks';

export const UserPage: FC<{ id: string }> = ({ id }) => {
	const { user, remove } = useUser(id);
	const { data } = useSession();

	return (
		<>
			<div className="flex flex-col gap-10">
				<PageHeader>
					<PageHeaderContent>
						<Breadcrumbs
							links={[
								{
									title: 'Dashboard',
									href: '/',
								},
								{
									title: 'Admin Overview',
									href: '/admin',
								},
								{
									title: 'Users',
									href: '/admin',
								},
								{
									title: user ? user.name : id,
									href: `admin/user/${id}`,
								},
							]}
						/>
						<PageHeaderTitle>{user ? user.name : 'User'}</PageHeaderTitle>
						<PageHeaderDescription>{id}</PageHeaderDescription>
					</PageHeaderContent>
					<PageHeaderActions>
						<Button
							variant={'destructive'}
							disabled={data?.user?.email === user?.email}
							onClick={async () => {
								await remove();
							}}
						>
							Delete
						</Button>
						<Link href={`/admin/user/${id}/edit`}>
							<Button>Edit</Button>
						</Link>
					</PageHeaderActions>
				</PageHeader>

				<UserDetails user={user} />
			</div>
		</>
	);
};
