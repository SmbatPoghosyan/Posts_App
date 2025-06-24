import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function ContactModal({ onClose }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const suggestions = t('contactModal.suggestions', { returnObjects: true });

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const applySuggestion = (text) => {
    setMessage((prev) => (prev ? `${prev} ${text}` : text));
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
        className="relative bg-white rounded-lg p-6 w-11/12 max-w-md shadow-lg"
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full border rounded-md p-2"
            placeholder={t('contactModal.name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="w-full border rounded-md p-2"
            placeholder={t('contactModal.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            className="w-full border rounded-md p-2"
            rows="4"
            placeholder={t('contactModal.messagePlaceholder')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <div className="flex flex-wrap gap-2">
            {suggestions.map((text, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applySuggestion(text)}
                className="text-sm bg-gray-100 hover:bg-primary-600 hover:text-white transition px-3 py-1 rounded-full"
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
