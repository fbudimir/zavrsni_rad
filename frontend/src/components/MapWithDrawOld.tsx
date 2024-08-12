'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import { SketchPicker } from 'react-color';
import axios from 'axios';

const MapWithDraw = () => {
	const [selectedColor, setSelectedColor] = useState('#ff0000');
	const [teamColors, setTeamColors] = useState({
		team1: '#ff0000',
		team2: '#00ff00',
		team3: '#0000ff',
	});
	const [activeTeam, setActiveTeam] = useState('team1');
	const mapRef = useRef<L.Map | null>(null);
	const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
	const drawControlRef = useRef<L.Control.Draw | null>(null);

	useEffect(() => {
		// Load initial map data from the server
		const loadInitialData = async () => {
			try {
				const response = await (
					await axios.post('http://localhost:3000/api/handler', {
						endpoint: `/orders/${'clxqrpnnt000014khy0xcju76'}`,
						method: 'GET',
					})
				).data;
				const savedData = JSON.parse(response.data.mapData) || {};
				const initialCenter = savedData.center || [51.505, -0.09];
				const initialZoom = savedData.zoom || 13;

				// Check if the map is already initialized
				if (mapRef.current) {
					return;
				}

				const map = L.map('map').setView(initialCenter, initialZoom);
				mapRef.current = map;

				L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					attribution:
						'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				}).addTo(map);

				const drawnItems = new L.FeatureGroup();
				drawnItemsRef.current = drawnItems;
				map.addLayer(drawnItems);

				const drawControl = new (L.Control as any).Draw({
					edit: {
						featureGroup: drawnItems,
					},
					draw: {
						polygon: {
							shapeOptions: {
								color: selectedColor,
							},
						},
						polyline: {
							shapeOptions: {
								color: selectedColor,
							},
						},
						rectangle: {
							shapeOptions: {
								color: selectedColor,
							},
						},
						circle: {
							shapeOptions: {
								color: selectedColor,
							},
						},
						marker: false, // remove circle markers
						circlemarker: false,
					},
				});

				drawControlRef.current = drawControl;
				map.addControl(drawControl);

				map.on((L.Draw as any).Event.CREATED, function (event: any) {
					const layer = event.layer;
					layer.feature = layer.feature || { type: 'Feature', properties: {} };
					layer.feature.properties.color = selectedColor;

					if (
						layer instanceof L.Circle ||
						layer instanceof L.Polygon ||
						layer instanceof L.Polyline ||
						layer instanceof L.Rectangle
					) {
						layer.setStyle({ color: selectedColor });
					}
					drawnItems.addLayer(layer);
					saveMapData(drawnItems, map);
				});

				map.on('moveend', () => {
					saveMapData(drawnItems, map);
				});

				loadShapes(map, drawnItems, savedData);
			} catch (error) {
				console.error('Error loading initial map data:', error);
			}
		};

		loadInitialData();

		return () => {
			if (mapRef.current) {
				mapRef.current.off(); // remove all event listeners
				mapRef.current.remove(); // remove the map instance
				mapRef.current = null;
			}
		};
	}, [selectedColor]);

	useEffect(() => {
		if (drawControlRef.current) {
			drawControlRef.current.setDrawingOptions({
				polygon: {
					shapeOptions: {
						color: selectedColor,
					},
				},
				polyline: {
					shapeOptions: {
						color: selectedColor,
					},
				},
				rectangle: {
					shapeOptions: {
						color: selectedColor,
					},
				},
				circle: {
					shapeOptions: {
						color: selectedColor,
					},
				},
				marker: false, // remove marker option
				circlemarker: false, // remove circle marker option
			});
		}
	}, [selectedColor]);

	const saveMapData = async (drawnItems: L.FeatureGroup, map: L.Map) => {
		const shapesData: GeoJSON.FeatureCollection = {
			type: 'FeatureCollection',
			features: [],
		};
		const circles: any[] = [];

		drawnItems.eachLayer((layer) => {
			if (layer instanceof L.Circle) {
				const circle = layer as L.Circle;
				const circleData = {
					type: 'Feature',
					properties: {
						color: circle.options.color,
						radius: circle.getRadius(),
					},
					geometry: {
						type: 'Point',
						coordinates: [circle.getLatLng().lng, circle.getLatLng().lat],
					},
				};
				circles.push(circleData);
			} else if (
				layer instanceof L.Polygon ||
				layer instanceof L.Polyline ||
				layer instanceof L.Rectangle
			) {
				shapesData.features.push(
					(layer as L.Polygon | L.Polyline | L.Rectangle).toGeoJSON()
				);
			}
		});

		const mapData = {
			shapes: shapesData,
			circles: circles,
			center: map.getCenter(),
			zoom: map.getZoom(),
			units: [
				{ id: 'team1', name: 'Alpha Team', color: teamColors.team1 },
				{ id: 'team2', name: 'Bravo Squad', color: teamColors.team2 },
				{ id: 'team3', name: 'Charlie Team', color: teamColors.team3 },
			],
		};

		try {
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: `/orders/${'clxqrpnnt000014khy0xcju76'}`,
				method: 'PUT',
				data: { mapData: JSON.stringify(mapData) },
			});
		} catch (error) {
			console.error('Error saving map data:', error);
		}
	};

	const loadShapes = (
		map: L.Map,
		drawnItems: L.FeatureGroup,
		savedData: any
	) => {
		const shapesData = savedData.shapes as GeoJSON.FeatureCollection;
		const circlesData = savedData.circles;

		if (shapesData) {
			const geoJsonLayer = L.geoJSON(shapesData, {
				onEachFeature: function (feature, layer) {
					if (
						feature.properties &&
						feature.properties.color &&
						(layer instanceof L.Polygon ||
							layer instanceof L.Polyline ||
							layer instanceof L.Rectangle)
					) {
						layer.setStyle({ color: feature.properties.color });
					}
					drawnItems.addLayer(layer);
				},
			});
			map.addLayer(geoJsonLayer);
		}

		if (circlesData) {
			circlesData.forEach((circleData: any) => {
				if (!isNaN(circleData.properties.radius)) {
					const circle = L.circle(
						[
							circleData.geometry.coordinates[1],
							circleData.geometry.coordinates[0],
						],
						{
							color: circleData.properties.color,
							radius: circleData.properties.radius,
						}
					);
					drawnItems.addLayer(circle);
				}
			});
		}
	};

	const handleTeamClick = (team: string) => {
		setActiveTeam(team);
		setSelectedColor(teamColors[team as keyof typeof teamColors]);
	};

	const handleColorChange = (color: any) => {
		setSelectedColor(color.hex);
		setTeamColors({
			...teamColors,
			[activeTeam]: color.hex,
		});
		if (drawnItemsRef.current && mapRef.current)
			saveMapData(drawnItemsRef.current, mapRef.current);
	};

	return (
		<div className="flex">
			<div className="mr-5">
				<button
					className="mb-2 p-2 bg-blue-500 text-white rounded"
					onClick={() => handleTeamClick('team1')}
				>
					Team 1
				</button>
				{activeTeam === 'team1' && (
					<SketchPicker
						color={teamColors.team1}
						onChangeComplete={handleColorChange}
					/>
				)}
				<button
					className="mb-2 p-2 bg-blue-500 text-white rounded"
					onClick={() => handleTeamClick('team2')}
				>
					Team 2
				</button>
				{activeTeam === 'team2' && (
					<SketchPicker
						color={teamColors.team2}
						onChangeComplete={handleColorChange}
					/>
				)}
				<button
					className="mb-2 p-2 bg-blue-500 text-white rounded"
					onClick={() => handleTeamClick('team3')}
				>
					Team 3
				</button>
				{activeTeam === 'team3' && (
					<SketchPicker
						color={teamColors.team3}
						onChangeComplete={handleColorChange}
					/>
				)}
			</div>
			<div id="map" className="h-[80vh] w-[60vw]"></div>
		</div>
	);
};

export default MapWithDraw;
