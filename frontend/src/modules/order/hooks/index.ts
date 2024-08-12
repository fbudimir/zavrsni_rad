import { UnitType, unitListSchema } from '@/modules/unit/types/Unit';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { OrderType, orderListSchema, orderSchema } from '../types/Order';

export const useOrders = () => {
	const [orders, setOrders] = useState<OrderType[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchOrders = async () => {
		try {
			const _orders = await (
				await axios.post('http://localhost:3000/api/handler', {
					endpoint: '/orders',
					method: 'GET',
				})
			).data;

			// _orders.status za error handling

			const orders = orderListSchema.parse(_orders.data);

			if (orders) setOrders(orders);
		} catch (error) {
			console.error(error);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	const create = async () => {
		try {
			const _order = await (
				await axios.post('http://localhost:3000/api/handler', {
					endpoint: '/orders',
					method: 'POST',
					data: {
						description: 'New Order',
						priority: 'LOW',
						status: 'PENDING',
						mapData: '{}',
					},
				})
			).data.data;

			// _order.status za error handling

			// hard refresh
			window.location.href = `/order/${_order.id}/edit`;
		} catch (error) {
			console.error(error);
		}
	};

	return {
		orders,
		isLoading,
		create,
	};
};

export const useOrder = (id: string) => {
	const [order, setOrder] = useState<OrderType | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [units, setUnits] = useState<UnitType[]>([]);

	const fetchOrder = async () => {
		try {
			const _order = await (
				await axios.post('http://localhost:3000/api/handler', {
					endpoint: `/orders/${id}`,
					method: 'GET',
				})
			).data.data;

			const order = orderSchema.parse(_order);
			if (order) setOrder(order);

			const _assignedUnits = _order.assignedUnits;
			const assignedUnits = unitListSchema.parse(_assignedUnits);
			setUnits(assignedUnits);
		} catch (error) {
			console.error(error);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchOrder();
	}, []);

	const update = async (data: Partial<OrderType>) => {
		try {
			const _order = await (
				await axios.post('http://localhost:3000/api/handler', {
					endpoint: `/orders/${id}`,
					method: 'PUT',
					data,
				})
			).data;

			// _order.status za error handling

			const order = orderSchema.parse(_order.data);

			if (order) setOrder(order);

			// hard refresh
			window.location.reload();
		} catch (error) {
			console.error(error);
		}
	};

	const remove = async () => {
		try {
			const _order = await (
				await axios.post('http://localhost:3000/api/handler', {
					endpoint: `/orders/${id}`,
					method: 'DELETE',
				})
			).data;

			// hard refresh
			window.location.href = '/order';
		} catch (error) {
			console.error(error);
		}
	};

	const addUnits = async (unitIds: string[]) => {
		try {
			const _order = await (
				await axios.post('http://localhost:3000/api/handler', {
					endpoint: `/orders/addUnits`,
					method: 'POST',
					data: { unitIds: unitIds, orderId: id },
				})
			).data;

			// hard refresh
			window.location.reload();
		} catch (error) {
			console.error(error);
		}
	};

	const removeUnit = async (unitId: string) => {
		try {
			const _order = await (
				await axios.post('http://localhost:3000/api/handler', {
					endpoint: `/orders/removeUnits`,
					method: 'POST',
					data: { unitIds: [unitId], orderId: id },
				})
			).data;

			// hard refresh
			window.location.reload();
		} catch (error) {
			console.error(error);
		}
	};

	return {
		order,
		isLoading,
		update,
		remove,
		units,
		addUnits,
		removeUnit,
	};
};
