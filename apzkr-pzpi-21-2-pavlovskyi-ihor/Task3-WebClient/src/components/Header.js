// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';
import accountIcon from '../assets/account-icon.png';
import LanguageSelector from './LanguageSelector';
import { FormattedMessage } from 'react-intl';

const Header = ({ title, navigationItems, authButtons, accountButton }) => {
    return (
        <header className="header">
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container">
                    <Link className="navbar-brand logo" to="/">
                        {title}
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mx-auto">
                            {navigationItems.map((item) => (
                                <li key={item.id} className="nav-item">
                                    <Link className="nav-link" to={item.path}>
                                        <FormattedMessage id={item.labelId} defaultMessage={item.defaultLabel}/>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="navbar-nav">
                            <LanguageSelector/>
                            {authButtons && authButtons.map((button) => (
                                <Link key={button.id} to={button.path}
                                      className={`btn ${button.id === 'login' ? 'g-btn-add' : 'g-btn-view'} me-2`}>
                                    <FormattedMessage id={button.labelId} defaultMessage={button.defaultLabel}/>
                                </Link>
                            ))}
                            {accountButton && (
                                <Link to={accountButton.path} className="btn btn-link account-btn">
                                    <img src={accountIcon} alt="Account"/>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
