import {
	EquipmentType,
	equipmentListSchema,
} from '@/modules/equipment/types/Equipment';
import { OrderType, orderListSchema } from '@/modules/order/types/Order';
import {
	SoldierType,
	soldierListSchema,
} from '@/modules/soldier/types/Soldier';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ZodError, z } from 'zod';
import { UnitType, unitListSchema, unitSchema } from '../types/Unit';

export const useUnits = () => {
	const [units, setUnits] = useState<UnitType[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchUnits = async () => {
		try {
			const _units = await (
				await axios.post('http://localhost:3000/api/handler', {
					endpoint: '/units',
					method: 'GET',
				})
			).data;

			// _units.status za error handling

			const units = unitListSchema.parse(_units.data);

			if (units) setUnits(units);
		} catch (error) {
			console.error(error);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchUnits();
	}, []);

	const create = async () => {
		setIsLoading(true);
		const _unit = await (
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: '/units',
				method: 'POST',
				data: {
					name: 'New Unit',
					type: 'TEAM',
				},
			})
		).data;
		setIsLoading(false);

		// hard refresh
		window.location.href = `/unit/${_unit.data.id}/edit`;
		return;
	};

	const [availableUnits, setAvailableUnits] = useState<UnitType[]>([]);

	const fetchAvailableUnits = async () => {
		const _units = await (
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: '/units/availableUnits',
				method: 'POST',
			})
		).data;

		const units = unitListSchema.parse(_units.data);

		setAvailableUnits(units);
	};

	useEffect(() => {
		fetchAvailableUnits();
	}, []);

	return {
		units,
		isLoading,
		create,
		availableUnits,
	};
};

export const useUnit = (id?: string | null) => {
	const [unit, setUnit] = useState<UnitType | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [soldiers, setSoldiers] = useState<SoldierType[]>([]);
	const [subunits, setSubunits] = useState<UnitType[]>([]);
	const [equipments, setEquipment] = useState<EquipmentType[]>([]);
	const [orders, setOrders] = useState<OrderType[]>([]);

	const fetchUnit = async () => {
		if (!id) return;
		try {
			const _unit = await (
				await axios.post('http://localhost:3000/api/handler', {
					endpoint: `/units/${id}`,
					method: 'GET',
				})
			).data.data;
			const unit = unitSchema.parse(_unit);
			setUnit(unit);

			const _soldiers = _unit.soldiers;
			const soldiers = soldierListSchema.parse(_soldiers);
			setSoldiers(soldiers);

			const _subunits = _unit.subUnits;
			const subunits = unitListSchema.parse(_subunits);
			setSubunits(subunits);

			const _equipment = _unit.equipment;
			const equipment = equipmentListSchema.parse(_equipment);
			setEquipment(equipment);
		} catch (error) {
			console.error(error);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchUnit();
	}, []);

	const update = async (data: Partial<UnitType>) => {
		setIsLoading(true);
		const _unit = await (
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: `/units/${id}`,
				method: 'PUT',
				data: data,
			})
		).data;
		setIsLoading(false);

		// hard refresh
		window.location.href = `/unit/${id}`;
		return data;
	};

	const remove = async () => {
		setIsLoading(true);
		const _unit = await (
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: `/units/${id}`,
				method: 'DELETE',
			})
		).data;
		setIsLoading(false);

		// hard refresh
		window.location.href = '/unit';
		return;
	};

	const [eligibleLeaders, setEligableLeaders] = useState<SoldierType[]>([]);

	const fetchEligibleLeaders = async () => {
		if (!unit) return;

		const _leaders = await (
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: `/units/eligibleLeaders`,
				method: 'POST',
				data: {
					unitId: unit.id,
				},
			})
		).data.data;

		const leaders = soldierListSchema.parse(_leaders);

		setEligableLeaders([...leaders, ...(unit.leader ? [unit.leader] : [])]);
	};

	useEffect(() => {
		if (unit) {
			fetchEligibleLeaders();
		}
	}, [unit]);

	const [eligibleParentUnits, setEligableParentUnits] = useState<
		Pick<UnitType, 'id' | 'name' | 'class' | 'type'>[]
	>([]);
	const [eligibleSubUnits, setEligableSubUnits] = useState<
		Pick<UnitType, 'id' | 'name' | 'class' | 'type'>[]
	>([]);

	const fetchEligibleParentUnits = async () => {
		if (!unit) return;

		const _units = await (
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: `/units/availableUnits`,
				method: 'POST',
				data: {
					ofClassHigherThan: unit.class,
				},
			})
		).data.data;

		try {
			const units = z
				.array(
					unitSchema.pick({
						id: true,
						name: true,
						class: true,
						type: true,
					})
				)
				.parse(_units);

			setEligableParentUnits(units);
		} catch (error) {
			if (error instanceof ZodError) {
				console.log(error.issues);
			}
		}
	};

	useEffect(() => {
		if (unit) {
			fetchEligibleParentUnits();
		}
	}, [unit]);

	const fetchEligibleSubUnits = async () => {
		if (!unit) return;

		const _units = await (
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: `/units/availableUnits`,
				method: 'POST',
				data: {
					ofClassLowerThan: unit.class,
				},
			})
		).data.data;

		try {
			const units = z
				.array(
					unitSchema.pick({
						id: true,
						name: true,
						class: true,
						type: true,
					})
				)
				.parse(_units);

			setEligableSubUnits(units);
		} catch (error) {
			if (error instanceof ZodError) {
				console.log(error.issues);
			}
		}
	};

	useEffect(() => {
		if (unit) {
			fetchEligibleSubUnits();
		}
	}, [unit]);

	// const addSubUnit = async (unitId: string) => {
	// }

	const [availableSoldiers, setAvailableSoldiers] = useState<SoldierType[]>([]);

	const fetchAvailableSoldiers = async () => {
		try {
			const _soldiers = await (
				await axios.post('http://localhost:3000/api/handler', {
					endpoint: '/soldiers/availableSoldiers',
					method: 'POST',
				})
			).data;

			const soldiers = soldierListSchema.parse(_soldiers.data);

			if (soldiers) setAvailableSoldiers(soldiers);
		} catch (error) {
			console.error(error);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchAvailableSoldiers();
	}, []);

	const addSoldiers = async (soldierIds: string[]) => {
		setIsLoading(true);
		const _unit = await (
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: `/units/addSoldiers`,
				method: 'POST',
				data: {
					soldierIds: soldierIds,
					unitId: id,
				},
			})
		).data;
		setIsLoading(false);

		// hard refresh
		window.location.href = `/unit/${id}`;
		return;
	};

	const makeSoldierLeader = async (soldierId: string) => {
		setIsLoading(true);
		const _unit = await (
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: `/units/${id}`,
				method: 'PUT',
				data: {
					leaderId: soldierId,
				},
			})
		).data;
		setIsLoading(false);

		// hard refresh
		window.location.href = `/unit/${id}`;
		return;
	};

	const removeSoldier = async (soldierId: string) => {
		setIsLoading(true);
		const _unit = await (
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: `/units/removeSoldiers`,
				method: 'POST',
				data: {
					soldierIds: [soldierId],
					unitId: id,
				},
			})
		).data;
		setIsLoading(false);

		// hard refresh
		window.location.href = `/unit/${id}`;
		return;
	};

	const addSubUnit = async (unitIds: string[]) => {
		setIsLoading(true);
		const _unit = await (
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: `/units/addSubUnits`,
				method: 'POST',
				data: {
					subUnitIds: unitIds,
					unitId: id,
				},
			})
		).data;
		setIsLoading(false);

		// hard refresh
		window.location.href = `/unit/${id}`;
		return;
	};

	const removeSubUnit = async (unitId: string) => {
		setIsLoading(true);
		const _unit = await (
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: `/units/removeSubUnits`,
				method: 'POST',
				data: {
					subUnitIds: [unitId],
					unitId: id,
				},
			})
		).data;
		setIsLoading(false);

		// hard refresh
		window.location.href = `/unit/${id}`;
		return;
	};

	const addEquipment = async (equipmentIds: string[]) => {
		setIsLoading(true);
		const _unit = await (
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: `/units/addEquipment`,
				method: 'POST',
				data: {
					equipmentIds: equipmentIds,
					unitId: id,
				},
			})
		).data;
		setIsLoading(false);

		// hard refresh
		window.location.href = `/unit/${id}`;
		return;
	};

	const removeEquipment = async (equipmentId: string) => {
		setIsLoading(true);
		const _unit = await (
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: `/units/removeEquipment`,
				method: 'POST',
				data: {
					equipmentIds: [equipmentId],
					unitId: id,
				},
			})
		).data;
		setIsLoading(false);

		// hard refresh
		window.location.href = `/unit/${id}`;
		return;
	};

	const [eligibleEquipment, setEligableEquipment] = useState<EquipmentType[]>(
		[]
	);

	const fetchEligibleEquipment = async () => {
		if (!unit) return;

		const _equipment = await (
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: `/equipment/availableEquipment`,
				method: 'POST',
			})
		).data.data;

		const equipment = equipmentListSchema.parse(_equipment);

		setEligableEquipment(equipment);
	};

	useEffect(() => {
		if (unit) {
			fetchEligibleEquipment();
		}
	}, [unit]);

	return {
		unit,
		isLoading,
		update,
		remove,
		eligibleLeaders,
		eligibleParentUnits,
		soldiers,
		availableSoldiers,
		addSoldiers,
		makeSoldierLeader,
		removeSoldier,
		subunits,
		eligibleSubUnits,
		addSubUnit,
		removeSubUnit,
		equipments,
		eligibleEquipment,
		addEquipment,
		removeEquipment,
	};
};

export const useUnitOrders = (unitid: string) => {
	const [directActiveOrders, setDirectActiveOrders] = useState<OrderType[]>([]);
	const [indirectActiveOrders, setIndirectActiveOrders] = useState<OrderType[]>(
		[]
	);
	const [isLoading, setIsLoading] = useState(true);

	const fetchDirectActiveOrders = async () => {
		const _orders = await (
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: `/units/activeDirectOrders`,
				method: 'POST',
				data: {
					unitId: unitid,
				},
			})
		).data.data;

		const orders = orderListSchema.parse(_orders);

		setDirectActiveOrders(orders);
	};

	const fetchIndirectOrders = async () => {
		const _orders = await (
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: `/units/activeIndirectOrders`,
				method: 'POST',
				data: {
					unitId: unitid,
				},
			})
		).data.data;

		const orders = orderListSchema.parse(_orders);

		setIndirectActiveOrders(orders);
	};

	const fetchAll = async () => {
		await fetchDirectActiveOrders();
		await fetchIndirectOrders();
		setIsLoading(false);
	};

	useEffect(() => {
		fetchAll();
	}, []);

	return { directActiveOrders, indirectActiveOrders, isLoading };
};
