import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* --------------------------------------------------------------------
   LOGO — TEMP WORD-MARK
   --------------------------------------------------------------------
   Swap the <div> below with:
   <img src={require('../assets/logo.png')} alt="AutoLink Global" className="h-12 w-auto" />
   once you have a final logo file.
---------------------------------------------------------------------*/
const BrandLogo = () => (
  <div className="text-3xl md:text-4xl font-extrabold tracking-tight select-none">
    <span className="text-red-600">AutoLink</span>{' '}
    <span className="text-white">Global</span>
  </div>
);

/* --------------------------------------------------------------------
   FAQ ACCORDION
---------------------------------------------------------------------*/
const faqContent = [
  { q: 'What makes AutoLink Global different from other wholesalers?', a: 'We combine OEM-grade sourcing, Dubai free-zone logistics, and bulk-buy pricing to slash your landed costs without sacrificing quality.' },
  { q: 'Do you only sell in full-container loads?', a: 'For launch we prioritise FCL orders to unlock the best freight rates. Smaller mixed pallets will be supported later in 2025.' },
  { q: 'Which brands do your parts cover?', a: 'Our initial catalog focuses on Toyota, Honda, Ford F-Series, GM pickups, and Tesla body panels & lamps.' },
  { q: 'Are your lamps DOT/SAE compliant?', a: 'Yes. All lighting products carry DOT and SAE stamps and ship with photometric test reports on request.' },
  { q: 'How long does delivery to the US take?', a: 'Average door-to-door lead-time is 7-10 calendar days once the container leaves Dubai.' },
  { q: 'Can I track my shipment?', a: 'Absolutely—live milestone tracking and automated email updates are standard.' },
  { q: 'What payment terms do you offer?', a: 'Initial orders are prepaid. Net-30 terms are available after your second successful shipment.' },
  { q: 'Is there a minimum order value?', a: 'USD 40k per container allows us to keep freight cost per SKU ultra-low.' },
  { q: 'Do you provide return or damage allowances?', a: 'We include a 1.5 % breakage credit on every invoice and handle on-arrival claims within 48 hours.' },
  { q: 'Can I request custom branding or packaging?', a: 'Yes—private-label cartons and laser-etched part numbers are available for volume programs.' },
  { q: 'Do you stock electric-vehicle components?', a: 'Our 2025 roadmap adds EV cooling modules, charge ports, and battery trays.' },
  { q: 'How do I apply for a reseller account?', a: 'Click “Book a Quick Call” or send a reseller application to accounts@autolinkglobal.com.' },
  { q: 'Which Incoterms do you ship under?', a: 'Default terms are DDP to your door in the US (we handle customs). CIF and FOB quotes available on request.' },
  { q: 'Can you drop-ship directly to my customer?', a: 'Yes—we provide blind drop-shipping with your paperwork, no extra fee.' },
  { q: 'Is technical support available?', a: 'Our parts techs can cross-reference OEM numbers and provide fit-ment guidance 7 days a week.' },
];

const AccordionItem = ({ item, isOpen, onClick }) => (
  <div className="border-b border-gray-200">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center py-4 text-left focus:outline-none"
    >
      <span className="font-medium">{item.q}</span>
      <motion.span
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 0.2 }}
        className="ml-3 text-red-600"
      >
        ▶
      </motion.span>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="pb-4 pr-6 text-gray-700"
        >
          {item.a}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        {faqContent.map((item, i) => (
          <AccordionItem
            key={i}
            item={item}
            isOpen={openIdx === i}
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
};

/* --------------------------------------------------------------------
   MAIN LANDING PAGE
---------------------------------------------------------------------*/
function LandingPageReseller() {
  return (
    <div className="font-sans text-gray-800 selection:bg-red-600 selection:text-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-6">
        <div className="container mx-auto flex flex-col items-center text-center">
          <BrandLogo />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Rev Up Your Auto Business</h1>
          <p className="text-xl mb-8 max-w-2xl">
            Quality parts, unbeatable prices, lightning-fast delivery.<br className="hidden md:block" />
            AutoLink Global gives your shop the competitive edge.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.a
              href="/catalog.pdf"
              className="bg-red-600 text-white px-5 py-3 rounded-md text-lg font-semibold hover:bg-red-700 transition"
              whileHover={{ scale: 1.05 }}
              download
            >
              Download Catalog
            </motion.a>

            <a
              href="mailto:sales@autolinkglobal.com"
              className="bg-white text-gray-900 px-5 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition"
            >
              Contact Sales
            </a>

            <a
              href="#book-call"
              className="bg-transparent border border-white text-white px-5 py-3 rounded-md text-lg font-semibold hover:bg-white hover:text-red-600 transition"
            >
              Book a Quick Call
            </a>
          </div>
        </div>
      </section>

      {/* ... (Why Choose Us, Categories, How It Works, Success Stories remain unchanged) ... */}

      {/* FAQ */}
      <FAQSection />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-sm py-4 text-center">
        © 2025 AutoLink Global. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPageReseller;
