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
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2906.785!2d-79.8033!3d43.3255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882c9c3c2c9c0001%3A0x1234567890abcdef!2sPaletta%20Mansion!5e0!3m2!1sen!2sca!4v1234567890&markers=43.3255,-79.8011"
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
