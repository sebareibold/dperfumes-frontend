import React from "react";

interface SignatureScentHighlightProps {
  title: string;
  description: string;
  highlightTitle: string;
  highlightDescription: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export default function SignatureScentHighlight({
  title,
  description,
  highlightTitle,
  highlightDescription,
  buttonText,
  onButtonClick,
}: SignatureScentHighlightProps) {
  return (
    <section className="py-20 bg-[#ede6db]">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        {/* Texto principal */}
        <div className="flex-1 mb-8 md:mb-0">
          <h2 className="font-serif text-2xl md:text-3xl font-light text-[#2d2a26] mb-4">{title}</h2>
          <p className="text-lg text-[#2d2a26] font-light leading-relaxed max-w-xl">{description}</p>
        </div>
        {/* Recuadro destacado */}
        <div className="flex-1 flex justify-center">
          <div className="bg-[#f7f3ee] border border-[#e5dfd6] rounded-xl shadow p-8 min-w-[300px] max-w-xs flex flex-col items-start">
            <h3 className="font-serif text-xl font-light text-[#2d2a26] mb-2">{highlightTitle}</h3>
            <p className="text-base text-[#2d2a26] font-light mb-6">{highlightDescription}</p>
            <button
              className="bg-[#2d2a26] text-white font-serif text-base px-6 py-2 rounded shadow hover:bg-[#bfa77a] transition-colors"
              onClick={onButtonClick}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 