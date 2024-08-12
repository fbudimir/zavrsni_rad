import { FC } from 'react';
import { InfoCard } from '../../dashboard/components/InfoCard';
import { UserType } from '../types/User';

export const UserDetails: FC<{ user: UserType | null }> = ({ user }) => {
	if (!user) {
		return <div>User not found</div>;
	}

	return (
		<div className="grid grid-cols-2 gap-2">
			<InfoCard label="Name" value={user.name} />
			<InfoCard label="Email" value={user.email} />
		</div>
	);
};
