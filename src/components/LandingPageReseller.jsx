import React, { useState, useEffect, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

/* ---------------------------------------------------------------------
  LOGO ‐ Placeholder word‑mark
  ---------------------------------------------------------------------
  • Uses styled text so the build never fails due to missing image assets.
  • When your final logo file is ready, simply swap the <div> below with
    <img src={require('../assets/logo.png')} alt="AutoLink Global" className="h-14 md:h-16 mb-8" />
    or import logo from '../assets/logo.png';
*/
const Logo = () => (
  <div className="select-none text-3xl md:text-4xl font-extrabold leading-none tracking-wide mb-8">
    AutoLink<span className="text-red-600">Global</span>
  </div>
);

/* ---------------------------------------------------------------------
  FAQ  – minimal, collapsible accordion so users aren’t overwhelmed
--------------------------------------------------------------------- */
const faqItems = [
  {
    q: 'What types of auto parts do you specialise in?',
    a: 'Our MVP focuses on high-demand body panels and lighting (headlamps, tail-lamps, bumpers, fenders) from trusted Taiwanese OEM-approved factories.'
  },
  { q: 'Are your parts OEM or aftermarket?',
    a: 'All items meet or exceed SAE/DOT standards and are produced in ISO-certified facilities, giving you OEM-level fit and finish at aftermarket pricing.'
  },
  { q: 'How long does delivery to the US take?',
    a: 'Our strategic Dubai hub ensures very fast shipping to your door without customs headaches.'
  },
  { q: 'Is there a minimum order quantity (MOQ)?',
    a: 'Yes. To secure factory-direct pricing we currently operate on full-container or skid-lot quantities (≈ USD 40k). Mixed-model containers are allowed.'
  },
  { q: 'Can I mix different models/part numbers in one container?',
    a: 'Absolutely. We’ll work with you to build a mixed SKU manifest so you can stock a sensible spread of high-turn items.'
  },
  { q: 'How do payments work?',
    a: 'Customer funds are deposited into escrow. Once your shipment is confirmed on board, funds are released to us and production/dispatch begins.'
  },
  { q: 'Do you offer credit terms?',
    a: 'For the MVP we operate on escrow/pre-paid terms. Credit programs will roll out after consistent order history (≈3 containers).'
  },
  { q: 'What warranty do you provide?',
    a: 'We back every part with a standard 12-month warranty against manufacturing defects. Extended plans available for volume clients.'
  },
  { q: 'Are returns accepted?',
    a: 'Yes—if a part arrives damaged or does not fit the specified vehicle, we arrange replacement or credit. Full return guidelines are in the supply agreement.'
  },
  { q: 'Which US ports do you ship to?',
    a: 'Los Angeles, Long Beach, Houston, Newark (NY/NJ) and Savannah. Inland drayage to your facility can be quoted on request.'
  },
  { q: 'Can I brand the packaging with my logo?',
    a: 'Private-label options are available for repeat clients. MOQ for custom prints is typically 300 units per part number.'
  },
  { q: 'How are duties and customs handled?',
    a: 'Our forwarder files all ISF and entry paperwork. Duties (2.5 % ad valorem on most parts) are billed at cost; we’ll guide you through every step.'
  },
  { q: 'Do you provide fitment data or catalog feeds?',
    a: 'Yes—CSV/XML fitment tables (year/make/model) and hi-res imagery are included so you can update your webshop instantly.'
  },
  { q: 'Is drop-shipping to my customers possible?',
    a: 'Large-parcel drop-ship from our US 3PL is slated for phase 2. Join the wait-list and we’ll notify you when live.'
  },
  { q: 'How do I get started?',
    a: 'Click “Book a Quick Call” to schedule a 15-minute discovery session. We’ll review your part list, map savings, and design your first container load.'
  }
];

const FAQItem = ({ q, a, idx, isOpen, onToggle }) => (
  <div className="border-b border-gray-200">
    <button
      onClick={() => onToggle(idx)}
      className="w-full flex justify-between items-center py-4 text-left focus:outline-none group"
    >
      <span className="font-medium text-gray-800 group-hover:text-red-600 transition">
        {q}
      </span>
      <Motion.span
        className="text-red-600 transform"
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
  const [openIdx, setOpenIdx] = useState(null);
  const toggle = (idx) => setOpenIdx(idx === openIdx ? null : idx);

  return (
    <section className="bg-white py-12 px-6" id="faq">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div
          className="divide-y divide-gray-200 max-h-96 overflow-y-auto overflow-x-hidden rounded-md faq-scroll"
        >
          {faqItems.map((item, idx) => (
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
  const calendlyRef = useRef(null);

  useEffect(() => {
    const initCalendly = () => {
      if (window.Calendly && calendlyRef.current) {
        window.Calendly.initInlineWidget({
          url: 'https://calendly.com/sampogosyan1995/30min?text_color=dc2626&primary_color=151d2b',
          parentElement: calendlyRef.current,
        });
      }
    };

    if (window.Calendly) {
      initCalendly();
      return undefined;
    }

    const script = document.querySelector(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]',
    );
    if (script) {
      script.addEventListener('load', initCalendly);
      return () => script.removeEventListener('load', initCalendly);
    }

    const newScript = document.createElement('script');
    newScript.src =
      'https://assets.calendly.com/assets/external/widget.js';
    newScript.async = true;
    newScript.onload = initCalendly;
    document.body.appendChild(newScript);
    return () => newScript.removeEventListener('load', initCalendly);
  }, []);

  return (
    <div className="font-sans text-gray-800 scroll-smooth">
      {/* Hero */}
      <header>
        <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-6">
          <div className="container mx-auto text-center flex flex-col items-center">
            <Logo />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Wholesale OEM Auto Parts Direct from Factory</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Factory-direct pricing, OEM quality and fast shipping from Dubai.
              <br className="hidden md:block" />
              AutoLink Global gives wholesale resellers a competitive edge.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/catalog.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 text-white px-5 py-3 rounded-md text-lg font-semibold hover:bg-red-700 transition"
              >
                Download Catalog
              </a>
              <a
                href="mailto:sales@autolinkglobal.com?subject=Parts%20Inquiry"
                className="bg-white text-gray-900 px-5 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </section>
      </header>

      <main>
      {/* Why Choose Us */}
        <section className="py-12 bg-white text-gray-900">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold mb-8 text-center">Why Choose AutoLink Global for Auto Parts?</h2>
            <div className="md:flex md:space-x-8 space-y-8 md:space-y-0">
              <div className="flex-1 bg-gray-100 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-2">OEM-Level Quality</h3>
                <p>All parts meet or exceed SAE/DOT standards and come with a solid warranty.</p>
              </div>
              <div className="flex-1 bg-gray-100 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Direct-from-Factory Pricing</h3>
                <p>Skip the middle-man. Our Taiwan partnerships let you save 10-15% on average.</p>
              </div>
              <div className="flex-1 bg-gray-100 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p>Our strategic Dubai hub ensures quick shipping to the US without customs headaches.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA linking to booking section */}
        <section className="py-16 bg-gray-900 text-center text-white px-6">
          <h2 className="text-3xl font-bold mb-4">Ready to turbo-charge profits?</h2>
          <p className="text-lg mb-8 max-w-xl mx-auto">
            Join dozens of US body shops already saving on premium parts.
          </p>
          <a
            href="#book-call"
            className="inline-block bg-red-600 text-white px-7 py-4 rounded-md text-lg font-semibold hover:bg-red-700 transition"
          >
            Book a Quick Call
          </a>
        </section>

        {/* FAQ – collapsible */}
        <FAQSection />

        {/* Booking section with Calendly */}
        <section id="book-call" className="py-16 bg-gray-900 text-center text-white px-6">
          <h2 className="text-4xl font-extrabold text-red-500 mb-4">Book Your Free Discovery Call</h2>
          <p className="text-lg mb-4 max-w-xl mx-auto">
            Spend 15 minutes with our team to learn how you can save big on premium parts.
          </p>
          <p className="mb-8 max-w-xl mx-auto">
            Choose a time that works for you—we’ll review your parts list and map out exact savings with AutoLink Global.
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
      <footer className="bg-gray-900 text-gray-400 text-sm py-4 text-center">
        © 2025 AutoLink Global. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPageReseller;
