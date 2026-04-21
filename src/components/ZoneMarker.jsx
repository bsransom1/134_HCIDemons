import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const greenIcon = L.divIcon({
  className: "zot-zone-marker",
  html: `<div style="width:20px;height:20px;border-radius:9999px;background:#16a34a;border:3px solid white;box-shadow:0 1px 6px rgba(0,0,0,.35)"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export default function ZoneMarker({ zone, onSuggest }) {
  return (
    <Marker position={[zone.lat, zone.lng]} icon={greenIcon}>
      <Popup>
        <div className="w-48 text-sm">
          <p className="font-semibold text-slate-900">{zone.name}</p>
          <p className="mt-0.5 text-xs text-slate-600">{zone.hours}</p>
          <p className="mt-1 text-xs text-slate-500">
            {zone.indoor ? "Indoor" : "Outdoor"}
            {zone.hasCameras ? " · Cameras" : ""}
          </p>
          {onSuggest && (
            <button
              type="button"
              onClick={() => onSuggest(zone)}
              className="mt-2 inline-block rounded-full bg-uci-blue px-3 py-1 text-xs font-semibold text-white"
            >
              Suggest this spot
            </button>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
