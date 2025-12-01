
import React from 'react';
import FadeIn from '../components/FadeIn';
import { GALLERY_ITEMS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

const Gallery: React.FC = () => {
    const { t, language } = useLanguage();

    return (
        <div className="w-full pt-32 pb-20 min-h-screen bg-black-rich">
            <div className="max-w-screen-xl mx-auto px-6">
                <FadeIn>
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <span className="w-8 h-px bg-gold-400" aria-hidden="true"></span>
                            <span className="text-gold-400 uppercase tracking-widest text-xs font-bold">{t('gallery.subtitle')}</span>
                            <span className="w-8 h-px bg-gold-400" aria-hidden="true"></span>
                        </div>
                        <h1 className="text-white text-5xl md:text-6xl font-serif mb-6">{t('gallery.title')}</h1>
                        <p className="text-white/60 text-lg leading-relaxed font-light">
                            {t('gallery.description')}
                        </p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
                    {GALLERY_ITEMS.map((item, index) => (
                        <FadeIn
                            key={item.id}
                            delay={index * 0.1}
                            className={`relative overflow-hidden group cursor-pointer border border-white/5
                        ${item.size === 'tall' ? 'row-span-2' : ''}
                        ${item.size === 'wide' ? 'col-span-2' : ''}
                        ${item.size === 'large' ? 'col-span-2 row-span-2' : ''}
                    `}
                        >
                            <img
                                src={item.image}
                                alt={item.alt[language]}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-500" aria-hidden="true" />
                            <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black-rich to-transparent" aria-hidden="true">
                                <p className="text-gold-300 font-serif italic text-xl">{item.alt[language]}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Gallery;
