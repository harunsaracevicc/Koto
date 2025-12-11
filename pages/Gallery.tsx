import React, { useState, useEffect } from 'react';
import FadeIn from '../components/FadeIn';
import { GALLERY_ITEMS as STATIC_GALLERY_ITEMS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { fetchGalleryItems, deleteGalleryItem, seedDatabase } from '../lib/api';
import { GalleryItem } from '../types';
import { Trash2, RefreshCw } from 'lucide-react';

const Gallery: React.FC = () => {
    const { t, language } = useLanguage();
    const { isAdmin } = useAuth();

    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        setLoading(true);
        const fetched = await fetchGalleryItems();
        if (fetched.length > 0) {
            setItems(fetched);
        } else {
            setItems([]);
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Delete this image?')) return;
        try {
            await deleteGalleryItem(id);
            setItems(prev => prev.filter(i => i.id !== id));
        } catch (error) {
            console.error(error);
            alert('Failed to delete');
        }
    };

    const handleSeed = async () => {
        if (!window.confirm('This will populate the database with default items if tables are empty. Continue?')) return;
        setSeeding(true);
        try {
            const result = await seedDatabase();
            alert(`Seeding complete! Menu: ${result.seededMenu}, Gallery: ${result.seededGallery}`);
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Failed to seed database. Check console.');
        } finally {
            setSeeding(false);
        }
    };

    return (
        <div className="w-full pt-32 pb-20 min-h-screen bg-black-rich">
            <div className="max-w-screen-xl mx-auto px-6">
                <FadeIn>
                    <div className="text-center max-w-3xl mx-auto mb-16 relative">
                        {isAdmin && (
                            <button
                                onClick={handleSeed}
                                disabled={seeding}
                                className="absolute top-0 right-0 bg-white/10 p-2 rounded-full hover:bg-gold-500 text-white transition-colors"
                                title="Seed Database from Constants"
                            >
                                <RefreshCw size={20} className={seeding ? "animate-spin" : ""} />
                            </button>
                        )}
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

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
                    {items.map((item, index) => (
                        <FadeIn
                            key={item.id}
                            delay={index * 0.1}
                            className={`relative overflow-hidden group border border-white/5
                        ${item.size === 'tall' ? 'row-span-2' : ''}
                        ${item.size === 'wide' ? 'col-span-2' : ''}
                        ${item.size === 'large' ? 'col-span-2 row-span-2' : ''}
                    `}
                        >
                            {isAdmin && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                    className="absolute top-2 right-2 z-20 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                            <img
                                src={item.image}
                                alt={item.alt[language]}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-500" aria-hidden="true" />
                            <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black-rich to-transparent pointer-events-none" aria-hidden="true">
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
