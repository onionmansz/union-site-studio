const RegistrySection = () => {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
          Gift Registry
        </h2>
        <p className="text-xl text-foreground max-w-2xl mx-auto mb-10">
          We just want you there! But if gifts are your thing, here's where we've registered.
        </p>
        <a
          href="https://www.myregistry.com/wedding-registry/genna-sd-and-julian-k-toronto-on/5242937"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-rose hover:bg-rose/90 text-rose-foreground font-semibold px-8 py-3 rounded-md transition-colors shadow-romantic"
        >
          View Registry
        </a>
      </div>
    </section>
  );
};

export default RegistrySection;
