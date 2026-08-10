"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in React Leaflet
const icon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
}

function LocationMarker({ position, onChange }: { position: [number, number]; onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={icon}></Marker>
  );
}

export function LocationPicker({ latitude, longitude, onChange }: LocationPickerProps) {
  const [mounted, setMounted] = useState(false);
  const position: [number, number] = [latitude, longitude];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full bg-paper flex items-center justify-center border border-hairline rounded-xl">Loading map...</div>;
  }

  return (
    <MapContainer
      center={position}
      zoom={15}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      className="rounded-xl border border-hairline z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={position} onChange={onChange} />
    </MapContainer>
  );
}
