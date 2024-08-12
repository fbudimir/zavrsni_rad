import { formatDistance, subDays } from 'date-fns';
import { FC } from 'react';
import { InfoCard } from '../../dashboard/components/InfoCard';
import { OrderType } from '../types/Order';

export const OrderDetails: FC<{ order: OrderType | null }> = ({ order }) => {
	if (!order) {
		return <div>Order not found</div>;
	}

	return (
		<div className="grid grid-cols-2 gap-2">
			<InfoCard label="Description" value={order.description} />
			<InfoCard
				label="Created At"
				value={formatDistance(
					subDays(new Date(order.createdAt), 3),
					new Date(),
					{
						addSuffix: true,
					}
				)}
			/>
			<InfoCard label="Priority" value={order.priority} />
			<InfoCard label="Status" value={order.status} />
		</div>
	);
};
