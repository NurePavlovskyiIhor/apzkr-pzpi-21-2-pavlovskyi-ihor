// src/components/LanguageSelector.js
import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

const LanguageSelector = () => {
    const { language, changeLanguage } = useContext(LanguageContext);

    const handleLanguageChange = (e) => {
        changeLanguage(e.target.value);
    };

    return (
        <select
            className="form-select language-select"
            value={language}
            onChange={handleLanguageChange}
        >
            <option value="en">EN</option>
            <option value="uk">UA</option>
        </select>
    );
};

export default LanguageSelector;