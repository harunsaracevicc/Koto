
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FadeIn from '../components/FadeIn';
import { MENU_ITEMS, GALLERY_ITEMS } from '../constants';
import { ArrowRight, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ASSETS } from '../assets/images';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const signatureDishes = [MENU_ITEMS[6], MENU_ITEMS[7], MENU_ITEMS[8]];
  const galleryPreview = GALLERY_ITEMS.slice(0, 17);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden" aria-label="Hero Section">
        {/* Video Background */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={ASSETS.HERO.POSTER}
            className="w-full h-full object-cover opacity-50 scale-105"
            tabIndex={-1}
          >
            <source src={ASSETS.HERO.VIDEO} type="video/mp4" />
          </video>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black-rich via-black-rich/60 to-black-rich/30 z-10"></div>
          <div
            className="absolute inset-0 opacity-20 z-10 mix-blend-overlay"
            style={{ backgroundImage: `url('${ASSETS.TEXTURES.STARDUST}')` }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-20 flex flex-col gap-8 items-center justify-center p-6 text-center max-w-5xl mx-auto mt-20">
          <FadeIn>
            <div className="flex flex-col items-center gap-2 mb-4">
              <span className="h-[2px] w-20 bg-gold-300" aria-hidden="true"></span>
              <span className="text-gold-200 tracking-[0.3em] text-sm uppercase font-bold">{t('home.est')}</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="text-gold-gradient text-7xl md:text-8xl lg:text-9xl font-black leading-tight tracking-tight mb-2 drop-shadow-2xl">
              {t('home.heroTitle')}
            </h1>
          </FadeIn>
          <FadeIn delay={0.4}>
            <h2 className="text-white/90 text-xl md:text-3xl font-serif italic font-light leading-relaxed mb-10 max-w-2xl">
              {t('home.heroSubtitle')}
            </h2>
          </FadeIn>
          <FadeIn delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={() => navigate('/menu')}
                className="px-10 py-4 bg-gold-gradient text-black-rich text-sm font-bold tracking-widest uppercase hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(212,175,55,0.2)] focus:outline-none focus:ring-2 focus:ring-gold-300 focus:ring-offset-2 focus:ring-offset-black-rich"
                aria-label={t('home.viewMenuBtn')}
              >
                {t('home.viewMenuBtn')}
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-10 py-4 border border-white/20 hover:border-gold-300 text-white hover:text-gold-300 text-sm font-bold tracking-widest uppercase bg-black-rich/50 backdrop-blur-sm hover:bg-black-rich transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-300 focus:ring-offset-2 focus:ring-offset-black-rich"
                aria-label={t('home.reserveBtn')}
              >
                {t('home.reserveBtn')}
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Philosophy / About Section */}
      <section id="about" className="py-24 lg:py-32 px-6 relative bg-black-surface" aria-labelledby="philosophy-heading">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" aria-hidden="true"></div>
        <div className="max-w-screen-xl mx-auto">
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              {/* Text Content */}
              <div className="flex flex-col gap-10 order-2 lg:order-1">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-px bg-gold-400" aria-hidden="true"></span>
                    <span className="text-gold-400 uppercase tracking-widest text-xs font-bold">{t('home.philosophyTitle')}</span>
                  </div>
                  <h2 id="philosophy-heading" className="text-white text-4xl md:text-6xl font-serif leading-tight">
                    {t('home.philosophyHeading')} <br />
                    <span className="text-gold-gradient italic">{t('home.philosophyHeadingSuffix')}</span>
                  </h2>
                  <p className="text-white/60 text-lg leading-relaxed font-light">
                    {t('home.philosophyText')}
                  </p>
                  <div className="flex gap-12 pt-4">
                    <div>
                      <p className="text-4xl text-gold-300 font-serif">15+</p>
                      <p className="text-white/40 text-xs tracking-widest uppercase mt-2">{t('home.yearsExcellence')}</p>
                    </div>
                    <div>
                      <p className="text-4xl text-gold-300 font-serif">200+</p>
                      <p className="text-white/40 text-xs tracking-widest uppercase mt-2">{t('home.premiumWines')}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/menu')}
                  className="group flex items-center gap-3 text-gold-200 text-sm tracking-widest uppercase font-bold hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gold-300 rounded p-1"
                  aria-label={t('home.exploreMenu')}
                >
                  {t('home.exploreMenu')} <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" aria-hidden="true" />
                </button>
              </div>

              {/* Image Grid */}
              <div className="relative order-1 lg:order-2">
                <div className="absolute -inset-4 bg-gold-500/10 rounded-full blur-3xl" aria-hidden="true"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-4 mt-12">
                    <div className="w-full aspect-[4/5] overflow-hidden rounded border border-white/5 hover:border-gold-300/30 transition-colors duration-700">
                      <img
                        src={ASSETS.PHILOSOPHY.VEGETABLES}
                        alt="Fresh vegetables on a cutting board"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="w-full aspect-[4/5] overflow-hidden rounded border border-white/5 hover:border-gold-300/30 transition-colors duration-700">
                      <img
                        src={ASSETS.PHILOSOPHY.INTERIOR}
                        alt="Elegant restaurant interior with warm lighting"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Signature Dishes */}
      <section className="py-24 bg-black-rich relative overflow-hidden" aria-labelledby="signature-heading">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gold-900/5 to-transparent pointer-events-none" aria-hidden="true"></div>

        <div className="max-w-screen-xl mx-auto px-6 relative z-10">
          <FadeIn>
            <div className="flex flex-col items-center text-center mb-16">
              <span className="text-gold-400 uppercase tracking-widest text-xs font-bold mb-4">{t('home.masterpieces')}</span>
              <h2 id="signature-heading" className="text-white text-4xl md:text-5xl font-serif">{t('home.signatureDishes')}</h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {signatureDishes.map((dish, index) => (
              <FadeIn key={dish.id} delay={index * 0.2} className="group cursor-pointer">
                <div className="flex flex-col gap-6 relative" role="article" aria-label={dish.name[language]}>
                  <div className="overflow-hidden relative border border-white/5 bg-black-card">
                    <img
                      src={dish.image}
                      alt={dish.name[language]}
                      className="w-full aspect-[3/4] object-cover transform transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 border border-white/10 group-hover:border-gold-300/50 transition-colors duration-500 m-2 pointer-events-none" aria-hidden="true"></div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-white text-2xl font-serif mb-2 group-hover:text-gold-300 transition-colors">{dish.name[language]}</h3>
                    <div className="w-12 h-px bg-white/10 mx-auto my-3 group-hover:bg-gold-300 transition-colors" aria-hidden="true"></div>
                    <p className="text-white/50 text-sm leading-relaxed mb-3 line-clamp-2">{dish.description[language]}</p>
                    <span className="text-gold-300 font-bold font-serif text-xl">{dish.price}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Preview */}
      <section className="py-24 px-6 relative bg-black-surface" aria-labelledby="experience-heading">
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" aria-hidden="true"></div>
        <div className="max-w-screen-xl mx-auto">
          <FadeIn>
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-gold-400 uppercase tracking-widest text-xs font-bold mb-2 block">{t('home.gallerySubtitle')}</span>
                <h2 id="experience-heading" className="text-white text-4xl md:text-5xl font-serif">{t('home.experienceTitle')}</h2>
              </div>
              <button
                onClick={() => navigate('/gallery')}
                className="hidden md:flex px-8 py-3 border border-white/20 text-white hover:border-gold-300 hover:text-gold-300 transition-all text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-gold-300"
                aria-label={t('home.viewGalleryBtn')}
              >
                {t('home.viewGalleryBtn')}
              </button>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 h-auto md:h-[600px]">
            {galleryPreview.map((item, index) => (
              <FadeIn
                key={item.id}
                delay={index * 0.1}
                className={`relative overflow-hidden group cursor-pointer ${index === 0 ? 'col-span-2 row-span-2' : index === 1 ? 'col-span-2' : 'col-span-1'}`}
              >
                <img
                  src={item.image}
                  alt={item.alt[language]}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-500" aria-hidden="true" />
                {/* Gold Border on Hover */}
                <div className="absolute inset-0 border-[1px] border-transparent group-hover:border-gold-300/40 m-2 transition-all duration-500 pointer-events-none" aria-hidden="true"></div>
              </FadeIn>
            ))}
          </div>

          <div className="flex justify-center mt-8 md:hidden">
            <button
              onClick={() => navigate('/gallery')}
              className="px-8 py-3 border border-white/20 text-white hover:border-gold-300 hover:text-gold-300 transition-all text-xs font-bold uppercase tracking-widest"
            >
              {t('home.viewGalleryBtn')}
            </button>
          </div>
        </div>
      </section>

      {/* Testimonial / Quote */}
      <section className="py-24 bg-black-rich flex justify-center items-center px-6" aria-label="Testimonials">
        <FadeIn>
          <div className="max-w-4xl text-center">
            <div className="flex justify-center gap-1 mb-6 text-gold-300" aria-label="5 out of 5 stars">
              <Star fill="currentColor" size={20} aria-hidden="true" />
              <Star fill="currentColor" size={20} aria-hidden="true" />
              <Star fill="currentColor" size={20} aria-hidden="true" />
              <Star fill="currentColor" size={20} aria-hidden="true" />
              <Star fill="currentColor" size={20} aria-hidden="true" />
            </div>
            <blockquote className="text-2xl md:text-4xl font-serif leading-relaxed text-white/90 italic mb-8">
              {t('home.testimonial')}
            </blockquote>
            <cite className="text-gold-400 uppercase tracking-widest text-xs font-bold not-italic">{t('home.reviewSource')}</cite>
          </div>
        </FadeIn>
      </section>
    </div>
  );
};

export default Home;
