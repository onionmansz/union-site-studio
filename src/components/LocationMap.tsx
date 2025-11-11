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

    // Initialize map centered on Paletta Mansion, Burlington
    map.current = L.map(mapContainer.current).setView([43.3255, -79.8011], 15);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Add marker for the venue
    const marker = L.marker([43.3255, -79.8011]).addTo(map.current);
    marker.bindPopup('<b>Paletta Mansion</b><br>4250 Lakeshore Rd<br>Burlington, ON L7L 1A6').openPopup();

    // Cleanup
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <h3 className="font-serif text-2xl font-semibold text-sage mb-2 flex items-center justify-center gap-2">
          <MapPin className="w-6 h-6 text-rose" />
          Venue Location
        </h3>
        <p className="text-muted-foreground">Paletta Mansion, Burlington</p>
        <p className="text-sm text-muted-foreground">4250 Lakeshore Rd, Burlington, ON L7L 1A6</p>
      </div>
      
      {/* OpenStreetMap */}
      <div className="mb-6">
        <p className="text-sm font-medium text-sage mb-2 text-center">OpenStreetMap View</p>
        <div 
          ref={mapContainer} 
          className="w-full h-[400px] rounded-lg shadow-elegant border border-sage/20"
        />
      </div>

      {/* Google Maps */}
      <div className="mb-6">
        <p className="text-sm font-medium text-sage mb-2 text-center">Google Maps View</p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2906.7845234567!2d-79.8033!3d43.3255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882c9c3c2c9c0001%3A0x1234567890abcdef!2sPaletta%20Mansion!5e0!3m2!1sen!2sca!4v1234567890"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg shadow-elegant border border-sage/20"
        />
      </div>

      <div className="mt-4 text-center flex gap-4 justify-center">
        <a
          href="https://www.google.com/maps/search/?api=1&query=Paletta+Mansion+Burlington+ON"
          target="_blank"
          rel="noopener noreferrer"
          className="text-rose hover:text-rose/80 font-medium underline"
        >
          Open in Google Maps
        </a>
        <a
          href="https://www.openstreetmap.org/?mlat=43.352867&mlon=-79.753141#map=15/43.352867/-79.753141"
          target="_blank"
          rel="noopener noreferrer"
          className="text-rose hover:text-rose/80 font-medium underline"
        >
          Open in OpenStreetMap
        </a>
      </div>
    </div>
  );
};

export default LocationMap;
