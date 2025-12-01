
import React from 'react';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import KotoLogo from './KotoLogo';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-black-surface border-t border-white/5 px-6 py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <div className="w-48 text-gold-300">
               <KotoLogo />
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs font-light">
              {t('footer.description')}
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-6">
            <h4 className="text-gold-200 font-serif text-lg">{t('footer.contact')}</h4>
            <ul className="flex flex-col gap-4 text-sm text-white/60 font-light">
              <li><a href="mailto:info@koto.ba" className="hover:text-gold-300 transition-colors border-b border-transparent hover:border-gold-300 pb-1" aria-label="Send email to info@koto.ba">info@koto.ba</a></li>
              <li><a href="tel:+38761000000" className="hover:text-gold-300 transition-colors border-b border-transparent hover:border-gold-300 pb-1" aria-label="Call +387 61 000 000">+387 61 000 000</a></li>
              <li className="leading-relaxed">{t('contact.addressValue')}</li>
            </ul>
          </div>

          {/* Hours */}
          <div className="flex flex-col gap-6">
            <h4 className="text-gold-200 font-serif text-lg">{t('footer.hours')}</h4>
            <ul className="flex flex-col gap-4 text-sm text-white/60 font-light">
              <li>
                <span className="block text-white/90 mb-1">{t('contact.monFri')}</span>
                <time>17:00 - 23:00</time>
              </li>
              <li>
                <span className="block text-white/90 mb-1">{t('contact.satSun')}</span>
                <time>12:00 - 00:00</time>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-6">
            <h4 className="text-gold-200 font-serif text-lg">{t('footer.follow')}</h4>
            <div className="flex gap-4">
              <a href="#" aria-label="Follow us on Facebook" className="text-white/60 hover:text-black-rich hover:bg-gold-300 transition-all p-3 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-gold-300">
                <Facebook size={18} aria-hidden="true" />
              </a>
              <a href="#" aria-label="Follow us on Instagram" className="text-white/60 hover:text-black-rich hover:bg-gold-300 transition-all p-3 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-gold-300">
                <Instagram size={18} aria-hidden="true" />
              </a>
              <a href="#" aria-label="Follow us on Twitter" className="text-white/60 hover:text-black-rich hover:bg-gold-300 transition-all p-3 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-gold-300">
                <Twitter size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-white/30 text-xs mt-20 pt-8 border-t border-white/5 font-light tracking-wider">
          <p>{t('footer.rights')}</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <a href="#" className="hover:text-gold-300 transition-colors">{t('footer.privacy')}</a>
             <a href="#" className="hover:text-gold-300 transition-colors">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
