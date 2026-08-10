"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { Search, Loader2, MapPin } from "lucide-react";
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
  const map = useMap();
  
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position} icon={icon}></Marker>
  );
}

export function LocationPicker({ latitude, longitude, onChange }: LocationPickerProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const position: [number, number] = [latitude, longitude];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          setSearchResults(data);
        } catch (error) {
          console.error("Geocoding error", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  if (!mounted) {
    return <div className="w-full h-full bg-paper flex items-center justify-center border border-hairline rounded-xl">Loading map...</div>;
  }

  return (
    <div className="relative w-full h-full">
      {/* Search Overlay */}
      <div className="absolute top-2 left-2 sm:left-14 right-2 sm:right-auto sm:w-80 z-[400]">
        <div className="relative bg-paper rounded-xl shadow-lg border border-hairline overflow-hidden flex flex-col">
          <div className="flex items-center px-3 h-12">
            <Search className="h-5 w-5 text-muted shrink-0" />
            <input 
              type="text" 
              placeholder="Search for a place..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full bg-transparent outline-none px-3 text-sm font-medium text-ink"
            />
            {isSearching && <Loader2 className="h-4 w-4 text-seal animate-spin shrink-0" />}
          </div>
          
          {searchResults.length > 0 && (
            <ul className="max-h-48 overflow-y-auto border-t border-hairline bg-paper z-[401]">
              {searchResults.slice(0, 5).map((result, idx) => (
                <li key={idx}>
                  <button 
                    type="button"
                    className="w-full text-left px-4 py-3 hover:bg-seal/5 flex items-start gap-3 transition-colors border-b border-hairline last:border-0"
                    onClick={() => {
                      const lat = parseFloat(result.lat);
                      const lon = parseFloat(result.lon);
                      onChange(lat, lon);
                      setSearchResults([]);
                      setSearchQuery("");
                    }}
                  >
                    <MapPin className="h-4 w-4 text-seal shrink-0 mt-0.5" />
                    <span className="text-sm text-ink line-clamp-2">{result.display_name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        className="rounded-xl border border-hairline z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} onChange={onChange} />
      </MapContainer>
    </div>
  );
}
