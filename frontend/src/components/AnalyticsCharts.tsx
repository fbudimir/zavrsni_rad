'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
} from 'recharts';

const COLORS = [
	'#00C49F',
	'#c44500',
	'#FFBB28',
	'#FF8042',
	'#A28FDB',
	'#397cb8',
];

const processData = (data: any) => {
	const statusCount = data.reduce((acc: any, entity: any) => {
		const status = entity.status;
		if (!acc[status]) {
			acc[status] = 0;
		}
		acc[status]++;
		return acc;
	}, {});

	return Object.keys(statusCount).map((status) => ({
		status,
		count: statusCount[status],
	}));
};

const processUnitsData = (data: any) => {
	const typeStatusCount = data.reduce((acc: any, unit: any) => {
		const type = unit.type;
		const status = unit.status;
		if (!acc[type]) {
			acc[type] = {};
		}
		if (!acc[type][status]) {
			acc[type][status] = 0;
		}
		acc[type][status]++;
		return acc;
	}, {});

	return Object.keys(typeStatusCount).map((type) => {
		const statuses = typeStatusCount[type];
		return {
			type,
			...statuses,
		};
	});
};

const AnalyticsCharts = () => {
	const [soldiersData, setSoldiersData] = useState([]);
	const [unitsData, setUnitsData] = useState([]);
	const [equipmentData, setEquipmentData] = useState([]);
	const [ordersData, setOrdersData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const soldiersResponse = await (
					await axios.post('http://localhost:3000/api/handler', {
						endpoint: '/soldiers',
						method: 'GET',
					})
				).data;
				const unitsResponse = await (
					await axios.post('http://localhost:3000/api/handler', {
						endpoint: '/units',
						method: 'GET',
					})
				).data;
				const equipmentResponse = await (
					await axios.post('http://localhost:3000/api/handler', {
						endpoint: '/equipment',
						method: 'GET',
					})
				).data;
				const ordersResponse = await (
					await axios.post('http://localhost:3000/api/handler', {
						endpoint: '/orders',
						method: 'GET',
					})
				).data;
				setSoldiersData(soldiersResponse.data);
				setUnitsData(unitsResponse.data);
				setEquipmentData(equipmentResponse.data);
				setOrdersData(ordersResponse.data);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, []);

	const processedSoldiersData = processData(soldiersData);
	const processedUnitsData = processUnitsData(unitsData);
	const processedEquipmentData = processData(equipmentData);
	const processedOrdersData = processData(ordersData);

	return (
		<div className="flex flex-col gap-10">
			{/* Soldiers row */}
			<div>
				<h2 className="text-3xl">Soldiers</h2>
				<br />
				<div className="flex flex-row">
					{/* Bar xhart */}
					<ResponsiveContainer width="60%" height={300}>
						<BarChart data={processedSoldiersData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="status" />
							<YAxis />
							<Tooltip />
							<Legend content={() => <></>} />
							<Bar dataKey="count">
								{processedSoldiersData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>

					{/* pie chart */}
					<ResponsiveContainer width="40%" height={300}>
						<PieChart>
							<Tooltip
								formatter={(value, name, props) =>
									`${props.payload.status}: ${value}`
								}
							/>
							<Pie
								data={processedSoldiersData}
								cx="50%"
								cy="50%"
								outerRadius={80}
								fill="#8884d8"
								dataKey="count"
								label={(entry) => entry.status}
							>
								{processedSoldiersData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Units row */}
			<div>
				<h2 className="text-3xl">Units</h2>
				<br />
				<div className="flex flex-row">
					{/* bar chart */}
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={processedUnitsData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="type" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey="ACTIVE" fill="#82ca9d" />
							<Bar dataKey="DECOMMISSIONED" fill="#8884d8" />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Equipment rows */}
			<div>
				<h2 className="text-3xl">Equipment</h2>
				<br />
				<div className="flex flex-row">
					{/* Bar chart */}
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={processedEquipmentData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="status" />
							<YAxis />
							<Tooltip />
							<Legend content={() => <></>} />
							<Bar dataKey="count" barSize={80}>
								{processedEquipmentData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>
			<div>
				<div className="flex flex-row">
					{/* Pie chart */}
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Tooltip
								formatter={(value, name, props) =>
									`${props.payload.status}: ${value}`
								}
							/>
							<Pie
								data={processedEquipmentData}
								cx="50%"
								cy="50%"
								outerRadius={80}
								fill="#8884d8"
								dataKey="count"
								label={(entry) => entry.status}
							>
								{processedEquipmentData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Orders rows */}
			<div>
				<h2 className="text-3xl">Orders</h2>
				<br />
				<div className="flex flex-row">
					{/* Bar chart */}
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={processedOrdersData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="status" />
							<YAxis />
							<Tooltip />
							<Legend content={() => <></>} />
							<Bar dataKey="count" barSize={80}>
								{processedOrdersData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			<div>
				<div className="flex flex-row">
					{/* Pie chart */}
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Tooltip
								formatter={(value, name, props) =>
									`${props.payload.status}: ${value}`
								}
							/>
							<Pie
								data={processedOrdersData}
								cx="50%"
								cy="50%"
								outerRadius={80}
								fill="#8884d8"
								dataKey="count"
								label={(entry) => entry.status}
							>
								{processedOrdersData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
};

export default AnalyticsCharts;
