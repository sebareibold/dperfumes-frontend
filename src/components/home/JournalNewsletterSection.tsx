import React from "react";

interface JournalArticle {
  imageUrl: string;
  title: string;
  description: string;
}

interface JournalNewsletterSectionProps {
  articles: JournalArticle[];
}

export default function JournalNewsletterSection({ articles }: JournalNewsletterSectionProps) {
  return (
    <section className="py-20 bg-[#f7f3ee]">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Journal Articles */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col items-start border border-[#e5dfd6]">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h3 className="font-serif text-xl font-light text-[#2d2a26] mb-2">{article.title}</h3>
              <p className="text-base text-[#2d2a26] font-light mb-2">{article.description}</p>
            </div>
          ))}
        </div>
        {/* Newsletter */}
        <div className="bg-[#ede6db] border border-[#e5dfd6] rounded-xl shadow p-8 flex flex-col items-start min-w-[280px] max-w-sm mx-auto lg:mx-0">
          <h4 className="font-serif text-lg font-light text-[#2d2a26] mb-4">Stay in the scent loop —<br />exclusive launches & stories.</h4>
          <form className="w-full flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-2 rounded border border-[#e5dfd6] bg-white text-[#2d2a26] font-light focus:outline-none focus:ring-2 focus:ring-[#bfa77a]"
            />
            <button
              type="submit"
              className="bg-[#2d2a26] text-white font-serif text-base px-6 py-2 rounded shadow hover:bg-[#bfa77a] transition-colors w-full"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
} 