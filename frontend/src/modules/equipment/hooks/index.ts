import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
	EquipmentType,
	equipmentListSchema,
	equipmentSchema,
} from '../types/Equipment';

export const useEquipments = () => {
	const [equipments, setEquipments] = useState<EquipmentType[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const router = useRouter();

	const fetchEquipments = async () => {
		setIsLoading(true);
		try {
			const _equipments = await (
				await axios.post('http://localhost:3000/api/handler', {
					endpoint: '/equipment',
					method: 'GET',
				})
			).data;

			// _equipments.status za error handling

			const equipments = equipmentListSchema.parse(_equipments.data);

			if (equipments) setEquipments(equipments);
		} catch (error) {
			console.error(error);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchEquipments();
	}, []);

	const create = async () => {
		setIsLoading(true);
		try {
			const _equipment = await (
				await axios.post('http://localhost:3000/api/handler', {
					endpoint: '/equipment',
					method: 'POST',
					data: {
						type: 'OTHER',
						name: 'New Equipment',
					},
				})
			).data;

			const equipment = equipmentSchema.parse(_equipment.data);

			if (equipment) setEquipments([...equipments, equipment]);
			setIsLoading(false);

			// redirect to created equipment
			router.push(`/equipment/${equipment.id}/edit`);

			return;
		} catch (error) {
			console.error(error);
		}
	};

	return {
		equipments,
		isLoading,
		create,
	};
};

export const useEquipment = (id: string) => {
	const [equipment, setEquipment] = useState<EquipmentType | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const fetchEquipment = async () => {
		setIsLoading(true);
		try {
			const _equipment = await (
				await axios.post('http://localhost:3000/api/handler', {
					endpoint: `/equipment/${id}`,
					method: 'GET',
				})
			).data;

			// _equipment.status za error handling

			const equipment = equipmentSchema.parse(_equipment.data);

			if (equipment) setEquipment(equipment);
		} catch (error) {
			console.error(error);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchEquipment();
	}, []);

	const update = async (data: Partial<EquipmentType>) => {
		setIsLoading(true);
		const _equipment = await (
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: `/equipment/${id}`,
				method: 'PUT',
				data: data,
			})
		).data;
		fetchEquipment();
		setIsLoading(false);

		// hard refresh
		window.location.href = `/equipment/${id}`;
		return data;
	};

	const remove = async () => {
		setIsLoading(true);
		const _equipment = await (
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: `/equipment/${id}`,
				method: 'DELETE',
			})
		).data;
		setIsLoading(false);
		window.location.href = '/equipment';
		return true;
	};

	return {
		equipment,
		isLoading,
		update,
		remove,
	};
};
