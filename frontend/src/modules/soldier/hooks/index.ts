import axios from 'axios';
import { useEffect, useState } from 'react';
import {
	SoldierType,
	soldierListSchema,
	soldierSchema,
} from '../types/Soldier';

export const useSoldiers = () => {
	const [soldiers, setSoldiers] = useState<SoldierType[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchSoldiers = async () => {
		try {
			const _soldiers = await (
				await axios.post('http://localhost:3000/api/handler', {
					endpoint: '/soldiers',
					method: 'GET',
				})
			).data;

			// _soldiers.status za error handling

			const soldiers = soldierListSchema.parse(_soldiers.data);

			if (soldiers) setSoldiers(soldiers);
		} catch (error) {
			console.error(error);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchSoldiers();
	}, []);

	const create = async () => {
		try {
			const _soldier = await (
				await axios.post('http://localhost:3000/api/handler', {
					endpoint: '/soldiers',
					method: 'POST',
					data: {
						name: 'New Soldier',
						rank: 'PVT',
						status: 'ACTIVE',
					},
				})
			).data.data;

			// console.log(_soldier);

			// hard refresh
			window.location.href = `/soldier/${_soldier.id}/edit`;
		} catch (error) {
			console.error(error);
		}
	};

	return {
		soldiers,
		isLoading,
		create,
	};
};

export const useSoldier = (id?: string | null) => {
	const [soldier, setSoldier] = useState<SoldierType | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchSoldier = async () => {
		if (!id) return;
		try {
			const _soldier = await (
				await axios.post('http://localhost:3000/api/handler', {
					endpoint: `/soldiers/${id}`,
					method: 'GET',
				})
			).data;

			// _soldier.status za error handling

			const soldier = soldierSchema.parse(_soldier.data);

			if (soldier) setSoldier(soldier);
		} catch (error) {
			console.error(error);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchSoldier();
	}, []);

	const update = async (data: Partial<SoldierType>) => {
		setIsLoading(true);
		const _soldier = await (
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: `/soldiers/${id}`,
				method: 'PUT',
				data: data,
			})
		).data;

		// fetchSoldier();
		setIsLoading(false);

		// hard refresh
		window.location.reload();
		return data;
	};

	const remove = async () => {
		setIsLoading(true);
		const _soldier = await (
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: `/soldiers/${id}`,
				method: 'DELETE',
			})
		).data;
		setIsLoading(false);

		// hard refresh
		window.location.href = '/soldier';
	};

	return {
		soldier,
		isLoading,
		update,
		remove,
	};
};
