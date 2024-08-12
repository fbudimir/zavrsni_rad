'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/lib/shadcn/ui/button';
import { DataTable } from '@/lib/shadcn/ui/datatable';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useUsers } from '../hooks';
import { UserType } from '../types/User';

export const columns: ColumnDef<UserType>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		id: 'action-open',
		cell: ({ row }) => {
			const user = row.original;

			return (
				<div className="flex flex-row gap-1 justify-end">
					<Link href={`/admin/user/${user.id}`}>
						<Button size="sm" variant={'secondary'}>
							<ArrowRight className="h-4 w-4" />
						</Button>
					</Link>
				</div>
			);
		},
	},
];

export const UsersTable = () => {
	const { users, isLoading } = useUsers();

	return <DataTable columns={columns} data={users} loading={isLoading} />;
};
