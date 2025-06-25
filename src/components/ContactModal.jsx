import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function ContactModal({ onClose }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [active, setActive] = useState(new Set());
  const suggestions = t('contactModal.suggestions', { returnObjects: true });

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const syncActiveFromMessage = (val) => {
    const newSet = new Set(
      suggestions.filter((s) => val.includes(s)),
    );
    setActive(newSet);
  };

  const applySuggestion = (text, evt) => {
    if (evt) evt.currentTarget.blur();
    let newMessage;
    if (active.has(text)) {
      newMessage = message
        .split(text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    } else {
      const next = message ? `${message} ${text}` : text;
      newMessage = next.trim();
    }
    setMessage(newMessage);
    syncActiveFromMessage(newMessage);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = `${message}\n\nFrom: ${name} <${email}>`;
    window.location.href = `mailto:sales@autolinkglobal.com?subject=${encodeURIComponent(
      'Inquiry from ' + name,
    )}&body=${encodeURIComponent(body)}`;
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-blue-50 font-serif border-2 border-blue-200 rounded-lg p-6 w-11/12 max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">{t('contactModal.title')}</h2>
        <form
          // onSubmit={handleSubmit}
          name="contact"
          method="POST"
          data-netlify="true"
          className="space-y-4"
        >
          <input type="hidden" name="form-name" value="contact" />
          <input
            type="text"
            name='name'
            className="w-full border border-blue-300 bg-blue-100 rounded-md p-2 placeholder-primary-600"
            placeholder={t('contactModal.name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            name='email'
            className="w-full border border-blue-300 bg-blue-100 rounded-md p-2 placeholder-primary-600"
            placeholder={t('contactModal.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            className="w-full border border-blue-300 bg-blue-100 rounded-md p-2 placeholder-primary-600"
            rows="4"
            name='message'
            type="text"
            placeholder={t('contactModal.messagePlaceholder')}
            value={message}
            onChange={(e) => {
              const val = e.target.value;
              setMessage(val);
              syncActiveFromMessage(val);
            }}
            required
          />
          <div className="flex flex-wrap gap-2">
            {suggestions.map((text, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => applySuggestion(text, e)}
                className={`text-sm px-3 py-1 rounded-full transition border cursor-pointer ${active.has(text) ? 'bg-primary-600 text-white border-primary-700' : 'bg-blue-100 text-primary-700 border-blue-300 hover:bg-primary-600 hover:text-white'}`}
              >
                {text}
              </button>
            ))}
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition"
            >
              {t('contactModal.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactModal;
