
import React, { useState } from 'react';
import FadeIn from '../components/FadeIn';
import { MENU_ITEMS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { formatPrice } from '../utils';

const categories = ["All", "Starters", "Main Dishes", "Pasta", "Pizza", "Grill", "Desserts", "Drinks"];

const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { t, language } = useLanguage();

  const filteredItems = activeCategory === "All"
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="w-full pt-32 pb-20 min-h-screen bg-black-rich">
      <div className="max-w-screen-xl mx-auto px-6">

        {/* Header */}
        <FadeIn>
          <div className="flex flex-col gap-6 mb-16 items-center text-center">
            <div className="flex items-center gap-4">
              <span className="w-12 h-px bg-gold-400" aria-hidden="true"></span>
              <span className="text-gold-400 uppercase tracking-widest text-xs font-bold">{t('menu.subtitle')}</span>
              <span className="w-12 h-px bg-gold-400" aria-hidden="true"></span>
            </div>
            <h1 className="text-white text-5xl md:text-7xl font-serif">
              {t('menu.title')}
            </h1>
            <p className="text-white/60 text-lg max-w-2xl font-light">
              {t('menu.description')}
            </p>
          </div>
        </FadeIn>

        {/* Filters */}
        <FadeIn delay={0.2}>
          <div className="flex justify-center flex-wrap gap-4 mb-16" role="group" aria-label="Menu Categories">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`px-6 py-2 transition-all duration-300 text-sm tracking-widest uppercase font-bold relative group focus:outline-none focus:ring-2 focus:ring-gold-300 rounded-sm
                  ${activeCategory === cat
                    ? 'text-gold-300'
                    : 'text-white/50 hover:text-white'
                  }`}
              >
                {t(`categories.${cat}`)}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gold-300 transition-all duration-300 origin-center ${activeCategory === cat ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`} aria-hidden="true"></span>
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-16" role="list">
          {filteredItems.map((item, index) => (
            <FadeIn key={item.id} className="group cursor-pointer">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start" role="listitem">
                {/* Image */}
                <div className="w-full sm:w-40 aspect-square shrink-0 overflow-hidden rounded-full border border-white/10 group-hover:border-gold-300/50 transition-colors duration-500">
                  <img
                    src={item.image}
                    alt={item.name[language]}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Text */}
                <div className="flex flex-col flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-baseline mb-2 border-b border-white/10 pb-2 border-dashed group-hover:border-gold-300/30 transition-colors">
                    <h3 className="text-white text-xl text-left font-serif group-hover:text-gold-300 transition-colors">
                      {item.name[language]}
                    </h3>
                    <span className="text-gold-300 font-bold font-serif text-lg">{formatPrice(item.price, language)}</span>
                  </div>
                  <p className="text-white/50 text-left text-sm leading-relaxed font-light">
                    {item.description[language]}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-full py-20 text-center text-white/50">
              <p className="font-serif italic text-xl">{t('menu.noItems')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
