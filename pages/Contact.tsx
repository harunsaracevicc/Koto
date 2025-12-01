
import React from 'react';
import FadeIn from '../components/FadeIn';
import { MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ASSETS } from '../assets/images';

const Contact: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full pt-32 pb-20 min-h-screen bg-black-rich">
      <div className="max-w-screen-xl mx-auto px-6">
        
        <FadeIn>
            <div className="mb-16 text-center lg:text-left">
                <span className="text-gold-400 uppercase tracking-widest text-xs font-bold mb-2 block">{t('contact.subtitle')}</span>
                <h1 className="text-white text-5xl md:text-6xl font-serif mb-6">{t('contact.title')}</h1>
                <p className="text-white/60 text-lg max-w-2xl font-light">
                    {t('contact.description')}
                </p>
            </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Info */}
            <FadeIn delay={0.2} className="flex flex-col gap-10">
                <div className="flex flex-col">
                    {/* Address */}
                    <div className="flex flex-col sm:flex-row gap-6 border-t border-white/10 py-8 group hover:border-gold-300/30 transition-colors">
                        <div className="w-40 shrink-0 text-gold-300 font-serif text-lg">{t('contact.addressLabel')}</div>
                        <address className="text-white/80 font-light text-lg not-italic">{t('contact.addressValue')}</address>
                    </div>
                    {/* Phone */}
                    <div className="flex flex-col sm:flex-row gap-6 border-t border-white/10 py-8 group hover:border-gold-300/30 transition-colors">
                        <div className="w-40 shrink-0 text-gold-300 font-serif text-lg">{t('contact.reservationsLabel')}</div>
                        <a href="tel:+38761000000" className="text-white/80 font-light text-lg hover:text-white transition-colors focus:outline-none focus:text-gold-300">+387 61 000 000</a>
                    </div>
                     {/* Email */}
                     <div className="flex flex-col sm:flex-row gap-6 border-t border-white/10 py-8 group hover:border-gold-300/30 transition-colors">
                        <div className="w-40 shrink-0 text-gold-300 font-serif text-lg">{t('contact.inquiriesLabel')}</div>
                        <a href="mailto:info@koto.com" className="text-white/80 font-light text-lg hover:text-white transition-colors focus:outline-none focus:text-gold-300">info@koto.com</a>
                    </div>
                    {/* Hours */}
                    <div className="flex flex-col sm:flex-row gap-6 border-t border-white/10 py-8 group hover:border-gold-300/30 transition-colors">
                        <div className="w-40 shrink-0 text-gold-300 font-serif text-lg">{t('contact.hoursLabel')}</div>
                        <div className="text-white/80 font-light text-lg">
                            <p>{t('contact.monFri')}: 17:00 - 23:00</p>
                            <p>{t('contact.satSun')}: 12:00 - 00:00</p>
                        </div>
                    </div>
                    <div className="border-t border-white/10 w-full"></div>
                </div>

                <div className="flex gap-6 mt-4">
                    <button className="flex-1 py-4 bg-gold-gradient text-black-rich text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-gold-300">
                        {t('contact.bookBtn')}
                    </button>
                </div>
            </FadeIn>

            {/* Map Visual */}
            <FadeIn delay={0.4} className="h-full min-h-[400px]">
                <div className="w-full h-full relative border border-white/10 overflow-hidden">
                    <img 
                        src={ASSETS.CONTACT.MAP} 
                        alt="Location Map of Koto Restaurant" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 pointer-events-none" aria-hidden="true" />
                    <div className="absolute bottom-6 left-6 bg-black-rich border border-gold-300/30 p-5 shadow-2xl flex items-center gap-4 max-w-xs">
                         <div className="p-3 bg-gold-300 rounded-full text-black-rich" aria-hidden="true">
                            <MapPin size={24} />
                         </div>
                         <div>
                             <p className="font-serif text-gold-200 text-lg">Koto Restaurant</p>
                             <p className="text-xs text-white/60 uppercase tracking-wider">{t('contact.openMaps')}</p>
                         </div>
                    </div>
                    {/* Make the entire map clickable if it's meant to open maps */}
                    <a href="#" className="absolute inset-0 z-10" aria-label={t('contact.openMaps')}></a>
                </div>
            </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default Contact;
