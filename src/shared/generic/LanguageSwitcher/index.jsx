import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.scss';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="LanguageSwitcher">
      <button className="language-button" onClick={() => changeLanguage('en')}>
        <span className="language-icon">&#x1F1EC;&#x1F1E7;</span> English
      </button>
      <button className="language-button" onClick={() => changeLanguage('fr')}>
        <span className="language-icon">&#x1F1EB;&#x1F1F7;</span> Français
      </button>
    </div>
  );
};

export default LanguageSwitcher;

/*
      <button className="language-button" onClick={() => changeLanguage('de')}>
        <span className="language-icon">&#x1F1E9;&#x1F1EA;</span> Deutsch
      </button>
*/
