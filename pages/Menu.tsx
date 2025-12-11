import React, { useState, useEffect } from 'react';
import FadeIn from '../components/FadeIn';
import { MENU_ITEMS as STATIC_MENU_ITEMS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { formatPrice } from '../utils';
import { fetchMenuItems, fetchCategories, Category } from '../lib/api';
import { MenuItem } from '../types';

const DEFAULT_CATEGORIES: Category[] = [
  { id: -1, name: { en: "All", bs: "Sve" } },
  { id: -2, name: { en: "Starters", bs: "Predjela" } },
  { id: -3, name: { en: "Main Dishes", bs: "Glavna Jela" } },
  { id: -4, name: { en: "Pasta", bs: "Tjestenine" } },
  { id: -5, name: { en: "Pizza", bs: "Pizza" } },
  { id: -6, name: { en: "Grill", bs: "Roštilj" } },
  { id: -7, name: { en: "Desserts", bs: "Deserti" } },
  { id: -8, name: { en: "Drinks", bs: "Pića" } }
];

const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { t, language } = useLanguage();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [items, dbCategories] = await Promise.all([
      fetchMenuItems(),
      fetchCategories()
    ]);

    if (items.length > 0) {
      setMenuItems(items);
    } else {
      // Strict DB mode: if empty, show empty. Do not fall back to constants.
      setMenuItems([]);
    }

    if (dbCategories.length > 0) {
      // Ensure "All" is always first
      setCategories([{ id: -1, name: { en: "All", bs: "Sve" } }, ...dbCategories]);
    } else {
      // Strict DB mode: if empty, show only "All" selector.
      setCategories([{ id: -1, name: { en: "All", bs: "Sve" } }]);
    }

    setLoading(false);
  };

  const filteredItems = activeCategory === "All"
    ? menuItems.filter(item => item.category !== "Drinks")
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="w-full pt-32 pb-20 min-h-screen bg-black-rich">
      <div className="max-w-screen-xl mx-auto px-6">

        {/* Header */}
        <FadeIn>
          <div className="flex flex-col gap-6 mb-16 items-center text-center relative">
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

        {/* Categories (Filters) */}
        <FadeIn delay={0.2}>
          <div className="flex justify-center flex-wrap gap-4 mb-16" role="group" aria-label="Menu Categories">
            {categories.map((cat) => (
              <div key={cat.id || cat.name.en} className="relative group">
                <button
                  onClick={() => setActiveCategory(cat.name.en)}
                  aria-pressed={activeCategory === cat.name.en}
                  className={`px-6 py-2 transition-all duration-300 text-sm tracking-widest uppercase font-bold relative focus:outline-none focus:ring-2 focus:ring-gold-300 rounded-sm
                    ${activeCategory === cat.name.en
                      ? 'text-gold-300'
                      : 'text-white/50 hover:text-white'
                    }`}
                >
                  {/* Prioritize showing localized name, fallback to English */}
                  {cat.name[language] || t(`categories.${cat.name.en}`) || cat.name.en}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gold-300 transition-all duration-300 origin-center ${activeCategory === cat.name.en ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`} aria-hidden="true"></span>
                </button>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-12" role="list">
          {filteredItems.map((item, index) => (
            <FadeIn key={item.id} className="group relative">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start" role="listitem">
                <div className="relative overflow-hidden rounded-full w-32 h-32 flex-shrink-0 border-2 border-gold-300/20 shadow-[0_0_15px_rgba(212,175,55,0.1)] group-hover:border-gold-300/50 transition-colors duration-500">
                  <img
                    src={item.image}
                    alt={item.name[language]}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 mb-2 relative">
                    <h3 className="text-xl font-serif text-gold-200 group-hover:text-gold-300 transition-colors">
                      {item.name[language]}
                    </h3>
                    <div className="absolute bottom-1 left-0 w-full h-px bg-white/10 hidden sm:block -z-10"></div>
                    <span className="text-lg font-bold text-gold-300 bg-black-rich pl-2">
                      {formatPrice(item.price, language)}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed font-light">
                    {item.description[language]}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <FadeIn>
            <div className="text-center py-20">
              <p className="text-white/40 text-lg">No items found in this category.</p>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
};

export default Menu;
