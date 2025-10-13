import { useEffect, useRef } from "react";

type MapPickerProps = {
  center?: { lat: number; lng: number };
  onPick: (coords: { lat: number; lng: number; address?: string }) => void;
  height?: string;
};

export default function MapPicker({
  center,
  onPick,
  height = "300px",
}: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    const L = (window as any).L;
    if (!mapRef.current || !L) return;
    // Default to Murang'a University coordinates if no center provided
    const defaultCenter = { lat: -0.72, lng: 37.15 }; // Murang'a University area
    const map = L.map(mapRef.current).setView(
      [center?.lat ?? defaultCenter.lat, center?.lng ?? defaultCenter.lng],
      center ? 15 : 13
    );
    leafletMapRef.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    function placeMarker(lat: number, lng: number) {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(
          map
        );
        markerRef.current.on("dragend", () => {
          const pos = markerRef.current.getLatLng();
          onPick({ lat: pos.lat, lng: pos.lng });
        });
      }
      onPick({ lat, lng });
    }

    map.on("click", (e: any) => {
      const { lat, lng } = e.latlng;
      placeMarker(lat, lng);
    });

    return () => {
      map.remove();
    };
  }, [center, onPick]);

  return <div ref={mapRef} style={{ width: "100%", height }} />;
}
