import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';
import logoMain from '../../public/logo_main.png';
import PdfPreview from './PdfPreview';
import StatsSection from './StatsSection';
import ContactModal from './ContactModal';

/* ---------------------------------------------------------------------
  LOGO ‐ Updated to use logo_main.png
  ---------------------------------------------------------------------
  • Replaces the placeholder word-mark with the actual logo image.
  • Ensures the logo is positioned and sized appropriately.
*/

const Logo = () => (
  <img
    src={logoMain}
    alt="AutoLink Global"
    className="h-36 md:h-48 mx-auto"
  />
);

/* ---------------------------------------------------------------------
  FAQ  – minimal, collapsible accordion so users aren’t overwhelmed
--------------------------------------------------------------------- */

const FAQItem = ({ q, a, idx, isOpen, onToggle }) => (
  <div className="border-b border-gray-200">
    <button
      onClick={() => onToggle(idx)}
      className="w-full flex justify-between items-center py-4 text-left focus:outline-none group"
    >
      <span className="font-medium text-gray-800 group-hover:text-primary-600 transition">
        {q}
      </span>
      <Motion.span
        className="text-primary-600 transform"
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        +
      </Motion.span>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <Motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="overflow-hidden pb-4 pr-2 text-gray-600"
        >
          {a}
        </Motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQSection = () => {
  const { t } = useTranslation();
  const items = t('faq.items', { returnObjects: true });
  const [openIdx, setOpenIdx] = useState(null);
  const toggle = (idx) => setOpenIdx(idx === openIdx ? null : idx);

  return (
    <section className="bg-white py-12 px-6" id="faq">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl font-bold mb-8 text-center">{t('faq.title')}</h2>
        <div
          className="divide-y divide-gray-200 max-h-96 overflow-y-auto overflow-x-hidden rounded-md faq-scroll"
        >
          {items.map((item, idx) => (
            <FAQItem
              key={idx}
              idx={idx}
              {...item}
              isOpen={idx === openIdx}
              onToggle={toggle}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------------------------------------------
  LANDING PAGE COMPONENT
--------------------------------------------------------------------- */
function LandingPageReseller() {
  const { t } = useTranslation();
  const calendlyRef = useRef(null);
  const [showCatalog, setShowCatalog] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    if (!calendlyRef.current) return;

    // Prevent duplicate injection
    if (calendlyRef.current.querySelector('iframe')) {
      console.log('Calendly already initialized. Skipping.');
      return;
    }

    if (window.Calendly) {
      window.Calendly.initInlineWidget({
        url: 'https://calendly.com/sampogosyan1995/30min?text_color=2563eb&primary_color=151d2b',
        parentElement: calendlyRef.current,
      });
      console.log('Calendly initialized.');
    } else {
      console.warn('Calendly script not found.');
    }
  }, []);


  return (
    <div className="font-sans text-gray-800 scroll-smooth">
      {showCatalog && (
        <PdfPreview file="/catalog.pdf" onClose={() => setShowCatalog(false)} />
      )}
      {showContact && (
        <ContactModal onClose={() => setShowContact(false)} />
      )}
      {/* Hero */}
      <header>
        <section className="relative bg-gradient-to-br from-white via-blue-50 to-white text-gray-900 py-16 px-6">
          <div className="absolute top-4 right-4">
            <LanguageSwitcher />
          </div>
          <div className="container mx-auto text-center flex flex-col items-center">
            <Logo />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('hero.title')}</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {t('hero.tagline1')}
              <br className="hidden md:block" />
              {t('hero.tagline2')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setShowCatalog(true)}
                className="bg-primary-600 text-white px-5 py-3 rounded-md text-lg font-semibold hover:bg-primary-700 transition"
              >
                {t('hero.view')}
              </button>
              <button
                onClick={() => setShowContact(true)}
                className="bg-white text-gray-900 px-5 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition"
              >
                {t('hero.contact')}
              </button>
            </div>
          </div>
        </section>
      </header>

      <main>
      {/* Why Choose Us */}
        <section className="py-12 bg-white text-gray-900">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold mb-8 text-center">{t('choose.title')}</h2>
            <div className="md:flex md:space-x-8 space-y-8 md:space-y-0">
              <div className="flex-1 bg-gray-100 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-2">{t('choose.oem.title')}</h3>
                <p>{t('choose.oem.desc')}</p>
              </div>
              <div className="flex-1 bg-gray-100 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-2">{t('choose.price.title')}</h3>
                <p>{t('choose.price.desc')}</p>
              </div>
              <div className="flex-1 bg-gray-100 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-2">{t('choose.delivery.title')}</h3>
                <p>{t('choose.delivery.desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA linking to booking section */}
        <section className="py-16 bg-blue-50 text-center text-gray-900 px-6">
          <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-lg mb-8 max-w-xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <a
            href="#book-call"
            className="inline-block bg-primary-600 text-white px-7 py-4 rounded-md text-lg font-semibold hover:bg-primary-700 transition"
          >
            {t('cta.button')}
          </a>
        </section>

        <StatsSection />

        {/* FAQ – collapsible */}
        <FAQSection />

        {/* Booking section with Calendly */}
        <section id="book-call" className="py-16 bg-gray-50 text-center text-gray-900 px-6">
          <h2 className="text-4xl font-extrabold text-primary-500 mb-4">{t('booking.title')}</h2>
          <p className="text-lg mb-4 max-w-xl mx-auto">
            {t('booking.subtitle1')}
          </p>
          <p className="mb-8 max-w-xl mx-auto">
            {t('booking.subtitle2')}
          </p>
          <div className="flex justify-center">
            <div
              ref={calendlyRef}
              style={{ width: '370px', height: '700px' }}
            />
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-gray-100 text-gray-600 text-sm py-4 text-center">
        {t('footer.text')}
      </footer>
    </div>
  );
}

export default LandingPageReseller;
