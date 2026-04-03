const PhotoUploadSection = () => {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
          Share Your Photos
        </h2>
        <p className="text-xl text-foreground max-w-2xl mx-auto mb-10">
          Help us relive the magic! Upload your photos and videos from our special day.
        </p>
        <a
          href="https://uploads.kaminskiwedding.ca"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-foreground hover:bg-foreground/90 text-background font-semibold px-8 py-3 rounded-md transition-colors shadow-romantic"
        >
          Upload Photos
        </a>
      </div>
    </section>
  );
};

export default PhotoUploadSection;
