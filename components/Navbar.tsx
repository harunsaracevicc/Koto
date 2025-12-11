
import React, { useState, useEffect } from 'react';
import { NavLink as RouterNavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import KotoLogo from './KotoLogo';
import { ASSETS } from '../assets/images';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Force Bosnian language and restrict navigation when user is logged in
  // Force Bosnian language restriction removed to allow language switching
  // useEffect(() => {
  //   if (user && language !== 'bs') {
  //     setLanguage('bs');
  //   }
  // }, [user, language, setLanguage]);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.menu'), path: '/menu' },
    { name: t('nav.about'), path: '/#about' },
    { name: t('nav.gallery'), path: '/gallery' },
    { name: t('nav.reservations'), path: '/contact' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const handleLinkClick = (path: string) => {
    if (path.startsWith('/#')) {
      const hash = path.substring(2);
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            el.focus(); // Move focus to the section for a11y
          }
        }, 100);
      } else {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          el.focus();
        }
      }
    }
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bs' : 'en');
  };

  return (
    <header className="fixed top-0 z-50 w-full flex flex-col font-sans">
      {/* Announcement Banner */}
      <div className="bg-black-rich border-b border-white/10 relative z-[51]">
        <div className="max-w-screen-xl mx-auto px-6 py-2">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-[10px] md:text-xs tracking-[0.15em] uppercase text-white/60 font-medium">
            <div className="flex items-center gap-4 md:gap-8">
              <div className="flex items-center gap-2 text-gold-300">
                <MapPin size={12} aria-hidden="true" />
                <span className="text-white/80 truncate max-w-[200px] md:max-w-none">{t('contact.addressValue')}</span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-gold-300">
                <Clock size={12} aria-hidden="true" />
                <span className="text-white/80">08:00 - 23:00</span>
              </div>
            </div>
            <div className="flex items-center gap-4 md:gap-8">
              <a href="tel:+38761000000" className="flex items-center gap-2 hover:text-gold-300 transition-colors text-white/80" aria-label="Call us at +387 61 000 000">
                <Phone size={12} className="text-gold-300" aria-hidden="true" />
                <span>+387 61 000 000</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={`w-full transition-all duration-500 ${isScrolled ? 'bg-black-rich/90 backdrop-blur-xl border-b border-white/5 shadow-2xl py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <RouterNavLink to="/" className="block group" aria-label="Koto Restaurant Home">
              <div className="w-32 md:w-40 text-gold-300 transform transition-all duration-500 group-hover:scale-105 group-hover:text-gold-200 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
                <KotoLogo />
              </div>
            </RouterNavLink>

            {/* Desktop Nav */}
            <nav className="hidden md:flex flex-1 justify-center" aria-label="Main Navigation">
              <div className="flex items-center gap-10">
                {navLinks.map((link) => (
                  link.path.startsWith('/#') ? (
                    <button
                      key={link.name}
                      onClick={() => handleLinkClick(link.path)}
                      className="text-white/70 text-sm tracking-widest font-sans uppercase hover:text-gold-300 transition-colors duration-300 relative group"
                    >
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-300 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  ) : (
                    <RouterNavLink
                      key={link.name}
                      to={link.path}
                      className={({ isActive }) =>
                        `text-sm tracking-widest font-sans uppercase transition-colors duration-300 relative group ${isActive && link.path !== '/' ? 'text-gold-300' : 'text-white/70 hover:text-gold-300'}`
                      }
                    >
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-300 transition-all duration-300 group-hover:w-full"></span>
                    </RouterNavLink>
                  )
                ))}
              </div>
            </nav>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-6">
              {/* User Status */}


              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center justify-center w-8 h-6 rounded-sm border border-white/10 hover:border-gold-300 overflow-hidden transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-gold-300"
                title={language === 'en' ? "Switch to Bosnian" : "Switch to English"}
                aria-label={language === 'en' ? "Switch to Bosnian language" : "Switch to English language"}
              >
                <img
                  src={language === 'en' ? ASSETS.FLAGS.EN : ASSETS.FLAGS.BS}
                  alt=""
                  className="w-full h-full object-cover"
                  aria-hidden="true"
                />
              </button>

              <button
                onClick={() => navigate('/menu')}
                className="flex items-center justify-center px-6 py-2 rounded-full bg-gold-gradient text-black-rich text-xs font-bold tracking-widest uppercase hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.2)] focus:outline-none focus:ring-2 focus:ring-gold-300 focus:ring-offset-2 focus:ring-offset-black-rich"
                aria-label={t('nav.menu')}
              >
                {t('nav.menu')}
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center justify-center w-8 h-6 rounded-sm border border-white/10 overflow-hidden"
                aria-label={language === 'en' ? "Switch to Bosnian language" : "Switch to English language"}
              >
                <img
                  src={language === 'en' ? ASSETS.FLAGS.EN : ASSETS.FLAGS.BS}
                  alt=""
                  className="w-full h-full object-cover"
                  aria-hidden="true"
                />
              </button>
              <button
                className="text-gold-200 p-2 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-gold-300 rounded"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: '0vh' }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: '0vh' }}
            className="md:hidden absolute top-full left-0 w-full bg-black-rich z-40 overflow-y-auto border-t border-white/10"
            style={{ maxHeight: 'calc(100vh - 80px)' }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-8 pb-20 pt-10">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {link.path.startsWith('/#') ? (
                    <button
                      onClick={() => {
                        handleLinkClick(link.path);
                        setIsOpen(false);
                      }}
                      className="text-3xl font-serif text-white/90 hover:text-gold-300 transition-colors"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <RouterNavLink
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `text-3xl font-serif ${isActive ? 'text-gold-gradient' : 'text-white/90 hover:text-gold-300'}`
                      }
                    >
                      {link.name}
                    </RouterNavLink>
                  )}
                </motion.div>
              ))}

              <div className="w-12 h-px bg-white/10 my-4" />

              <div className="flex flex-col items-center gap-4">
                <a href="tel:+38761000000" className="flex items-center gap-3 text-gold-300 font-sans tracking-widest">
                  <Phone size={16} aria-hidden="true" />
                  <span>+387 61 000 000</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
