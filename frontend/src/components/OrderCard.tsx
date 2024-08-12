'use client';

import React from 'react';
import MapWithDraw from './MapWithDraw';

export const OrderCard = ({ order }: any) => {
	return (
		<div>
			<div className="order-card">
				<p>Description: {order.description}</p>
				<p>Priority: {order.priority}</p>
				<p>Status: {order.status}</p>
				<p>Created At: {new Date(order.createdAt).toLocaleDateString()}</p>
			</div>
			<MapWithDraw></MapWithDraw>
		</div>
	);
};
