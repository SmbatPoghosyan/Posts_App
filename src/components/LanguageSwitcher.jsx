import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();

  const setLang = (lng) => {
    if (lng !== lang) {
      i18n.changeLanguage(lng);
      navigate(`/${lng}`);
    }
  };

  return (
    <div className="flex border rounded-full overflow-hidden bg-white text-gray-800 text-sm">
      {['en', 'es'].map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => setLang(lng)}
          className={`px-3 py-1 focus:outline-none transition-colors ${
            lang === lng ? 'bg-primary-600 text-white' : 'bg-white text-gray-800'
          }`}
          aria-pressed={lang === lng}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
