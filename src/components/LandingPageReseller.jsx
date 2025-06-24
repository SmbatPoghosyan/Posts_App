import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion as Motion, AnimatePresence, Reorder } from 'framer-motion';
import confetti from 'canvas-confetti';
import LanguageSwitcher from './LanguageSwitcher';
import logoMain from '../../public/logo_main.png';
import PdfPreview from './PdfPreview';

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
  INTERACTIVE DEMO COMPONENTS
--------------------------------------------------------------------- */

const DragUnlockDemo = () => {
  const { t } = useTranslation();
  const [unlocked, setUnlocked] = useState(false);
  const handleDragEnd = (_, info) => {
    const zone = document.getElementById('drop-zone');
    if (!zone) return;
    const rect = zone.getBoundingClientRect();
    const { x, y } = info.point;
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      setUnlocked(true);
    }
  };
  return (
    <section className="py-16 bg-white text-center">
      <h2 className="text-2xl font-bold mb-4">{t('interactive.unlock.title')}</h2>
      <p className="mb-6 text-gray-600">{t('interactive.unlock.desc')}</p>
      <div className="flex justify-center items-center space-x-8">
        {!unlocked && (
          <Motion.div
            drag
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            className="cursor-grab p-4 bg-primary-600 text-white rounded-full select-none"
          >
            🔑
          </Motion.div>
        )}
        <div
          id="drop-zone"
          className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-primary-600 rounded-lg"
        >
          {unlocked ? t('interactive.unlock.message') : '🔒'}
        </div>
      </div>
    </section>
  );
};

const SortCardsDemo = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState(['A', 'B', 'C']);
  return (
    <section className="py-16 bg-gray-50 text-center">
      <h2 className="text-2xl font-bold mb-4">{t('interactive.sort.title')}</h2>
      <p className="mb-6 text-gray-600">{t('interactive.sort.desc')}</p>
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="flex flex-col items-center space-y-4"
      >
        {items.map((it) => (
          <Reorder.Item
            key={it}
            value={it}
            className="w-24 p-4 bg-white shadow rounded-md cursor-grab"
          >
            {it}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </section>
  );
};

const ScratchOffDemo = () => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#9CA3AF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const scratch = (e) => {
    if (revealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) cleared++;
    }
    if (cleared / (canvas.width * canvas.height) > 0.5) {
      setRevealed(true);
    }
  };

  return (
    <section className="py-16 bg-white text-center">
      <h2 className="text-2xl font-bold mb-4">{t('interactive.scratch.title')}</h2>
      <p className="mb-6 text-gray-600">{t('interactive.scratch.desc')}</p>
      <div className="relative inline-block">
        <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold pointer-events-none">
          {revealed && t('interactive.scratch.revealed')}
        </div>
        <canvas
          ref={canvasRef}
          width={300}
          height={150}
          onPointerMove={scratch}
          className="border rounded-md select-none"
        />
      </div>
    </section>
  );
};

const DrawBoardDemo = () => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  const start = () => {
    drawing.current = true;
  };
  const end = () => {
    drawing.current = false;
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
  };
  const draw = (e) => {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#2563eb';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  return (
    <section className="py-16 bg-gray-50 text-center">
      <h2 className="text-2xl font-bold mb-4">{t('interactive.draw.title')}</h2>
      <p className="mb-6 text-gray-600">{t('interactive.draw.desc')}</p>
      <canvas
        ref={canvasRef}
        width={320}
        height={200}
        onPointerDown={start}
        onPointerUp={end}
        onPointerLeave={end}
        onPointerMove={draw}
        className="border rounded-md bg-white mx-auto select-none"
      />
    </section>
  );
};

const ConfettiSliderDemo = () => {
  const { t } = useTranslation();
  const [val, setVal] = useState(0);
  const handleChange = (e) => {
    const v = Number(e.target.value);
    setVal(v);
    if (v === 100) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };
  return (
    <section className="py-16 bg-white text-center">
      <h2 className="text-2xl font-bold mb-4">{t('interactive.confetti.title')}</h2>
      <p className="mb-6 text-gray-600">{t('interactive.confetti.desc')}</p>
      <input
        type="range"
        min="0"
        max="100"
        value={val}
        onChange={handleChange}
        className="w-64 accent-primary-600"
      />
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
              <a
                href="mailto:sales@autolinkglobal.com?subject=Parts%20Inquiry"
                className="bg-white text-gray-900 px-5 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition"
              >
                {t('hero.contact')}
              </a>
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

        {/* Interactive Demo Sections */}
        <DragUnlockDemo />
        <SortCardsDemo />
        <ScratchOffDemo />
        <DrawBoardDemo />
        <ConfettiSliderDemo />

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
