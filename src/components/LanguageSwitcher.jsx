import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
    document.documentElement.lang = e.target.value;
  };

  return (
    <select
      value={i18n.language}
      onChange={changeLanguage}
      className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm"
    >
      <option value="en">EN</option>
      <option value="es">ES</option>
    </select>
  );
}

export default LanguageSwitcher;
