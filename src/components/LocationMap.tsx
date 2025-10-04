import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

// Fix for default marker icon in leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map centered on Napa Valley
    map.current = L.map(mapContainer.current).setView([38.2975, -122.2869], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Add marker for the venue
    const marker = L.marker([38.2975, -122.2869]).addTo(map.current);
    marker.bindPopup('<b>Garden Grove Estate</b><br>123 Vineyard Lane<br>Napa Valley, CA').openPopup();

    // Cleanup
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <h3 className="font-serif text-2xl font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
          <MapPin className="w-6 h-6 text-rose" />
          Venue Location
        </h3>
        <p className="text-muted-foreground">Garden Grove Estate, Napa Valley</p>
      </div>
      <div 
        ref={mapContainer} 
        className="w-full h-[400px] rounded-lg shadow-elegant border border-sage/20"
      />
      <div className="mt-4 text-center">
        <a
          href="https://www.google.com/maps/search/?api=1&query=Napa+Valley+CA"
          target="_blank"
          rel="noopener noreferrer"
          className="text-rose hover:text-rose/80 font-medium underline"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  );
};

export default LocationMap;
