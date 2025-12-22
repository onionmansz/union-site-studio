import { MapPin } from 'lucide-react';

const LocationMap = () => {

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
      
      <iframe
        src="https://maps.google.com/maps?q=Paletta+Mansion+Burlington+ON&hl=en&z=15&output=embed"
        width="100%"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded-lg shadow-elegant border border-sage/20"
      />

      <div className="mt-4 text-center">
        <a
          href="https://www.google.com/maps/search/?api=1&query=Paletta+Mansion+Burlington+ON"
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
