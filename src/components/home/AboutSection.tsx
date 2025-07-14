interface AboutSectionProps {
  imageUrl: string;
  imageAlt?: string;
  title: string;
  description: string;
}

export default function AboutSection({ imageUrl, imageAlt, title, description }: AboutSectionProps) {
  return (
    <section className="py-20 bg-transparent" id="about">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 px-6">
        {/* Imagen */}
        <div className="flex-1 flex justify-center mb-8 md:mb-0">
          <img
            src={imageUrl}
            alt={imageAlt || "About the brand"}
            className="w-64 h-80 object-contain rounded-lg shadow-lg border border-[#e5dfd6] bg-white"
          />
        </div>
        {/* Texto */}
        <div className="flex-1 text-left">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-[#2d2a26] mb-6">{title}</h2>
          <p className="text-lg text-[#2d2a26] font-light leading-relaxed max-w-xl">{description}</p>
        </div>
      </div>
    </section>
  );
} 