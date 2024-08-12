'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import axios from 'axios';
import { useParams } from 'next/navigation';

const MapWithDraw = () => {
	const [selectedColor, setSelectedColor] = useState('#ff0000');
	const [units, setUnits] = useState<any[]>([]);
	const [activeUnit, setActiveUnit] = useState<string>('');
	const mapRef = useRef<L.Map | null>(null);
	const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
	const drawControlRef = useRef<L.Control.Draw | null>(null);

	const params = useParams();
	const orderId = params.id;

	useEffect(() => {
		const initializeMap = async () => {
			try {
				const response = await (
					await axios.post('http://localhost:3000/api/handler', {
						endpoint: `/orders/${orderId}`,
						method: 'GET',
					})
				).data;
				const mapData = JSON.parse(response.data.mapData) || {};
				const initialCenter = mapData.center || [51.505, -0.09];
				const initialZoom = mapData.zoom || 13;

				setUnits(mapData.units); // samo jednom
				if (!activeUnit && mapData.units.length > 0) {
					setActiveUnit(mapData.units[0]?.id || ''); // prvog ako ga ima
					setSelectedColor(mapData.units[0]?.color || '#9e271e');
				}

				if (mapRef.current) {
					// ocisti postojecu mapu ako je ima
					mapRef.current.off();
					mapRef.current.remove();
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

				map.on((L.Draw as any).Event.DELETED, function () {
					// Save map data when a shape is deleted
					saveMapData(drawnItems, map);
				});

				map.on((L.Draw as any).Event.EDITED, function () {
					// Save map data when a shape is edited
					saveMapData(drawnItems, map);
				});

				map.on('moveend', () => {
					saveMapData(drawnItems, map);
				});

				loadShapes(map, drawnItems, mapData);
			} catch (error) {
				console.error('Error loading initial map data:', error);
			}
		};

		initializeMap();

		return () => {
			if (mapRef.current) {
				mapRef.current.off();
				mapRef.current.remove();
				mapRef.current = null;
			}
		};
	}, [selectedColor]); // on color change

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
		};

		try {
			await axios.post('http://localhost:3000/api/handler', {
				endpoint: `/orders/updateMapData`,
				method: 'POST',
				data: {
					orderId: orderId,
					otherMapData: JSON.stringify(mapData),
				},
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
		const unitsData = savedData.units;

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

		if (unitsData && unitsData.length > 0) {
			unitsData.forEach((unit: any) => {
				const nPosition = unit.nPosition;
				const ePosition = unit.ePosition;
				if (
					nPosition !== null &&
					nPosition !== undefined &&
					ePosition !== null &&
					ePosition !== undefined
				) {
					const circle = new L.CircleMarker([nPosition, ePosition], {
						color: unit.color,
						radius: 10,
					});
					drawnItems.addLayer(circle);
				}
			});
		}
	};

	return (
		<div className="ml-5 flex">
			<div className="mr-5 mt-5 w-[20vh] flex flex-col">
				{units.map((unit) => (
					<button
						key={unit.id}
						className={`mb-2 p-1 rounded text-white ${
							activeUnit === unit.id ? 'font-bold' : ''
						}`}
						style={{ backgroundColor: unit.color }}
						onClick={() => {
							setSelectedColor(unit.color);
							setActiveUnit(unit.id); // SETAJ NOVOG UNITA
						}}
					>
						{unit.name}
					</button>
				))}
			</div>
			<div id="map" className="mb-5 mr-5 h-[100vh] w-[100%] border-2"></div>
		</div>
	);
};

export default MapWithDraw;
