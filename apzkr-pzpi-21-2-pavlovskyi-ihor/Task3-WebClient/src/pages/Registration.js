import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import '../styles/registration.css';
import { AuthContext } from '../contexts/AuthContext';
import { register } from '../services/AuthService';
import User from '../models/User';

const Registration = () => {
    const [userData, setUserData] = useState(new User('', '', '', ''));
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const registeredUser = await register(userData);
            login(registeredUser);
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <main className="user-account-main">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <h2 className="user-account-title">
                            <FormattedMessage id="registration.title" defaultMessage="Registration" />
                        </h2>
                        <form onSubmit={handleSubmit} className="user-account-info">
                            <div className="mb-3">
                                <label htmlFor="userName" className="form-label">
                                    <FormattedMessage id="registration.fullname" defaultMessage="Name" />
                                </label>
                                <input
                                    type="text"
                                    className="user-account-input-field"
                                    id="userName"
                                    name="userName"
                                    value={userData.userName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    <FormattedMessage id="registration.email" defaultMessage="Email" />
                                </label>
                                <input
                                    type="email"
                                    className="user-account-input-field"
                                    id="email"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">
                                    <FormattedMessage id="registration.password" defaultMessage="Password" />
                                </label>
                                <input
                                    type="password"
                                    className="user-account-input-field"
                                    id="password"
                                    name="password"
                                    value={userData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="user-account-btn-group">
                                <button type="submit" className="user-account-btn user-account-btn-primary">
                                    <FormattedMessage id="registration.submit" defaultMessage="Register" />
                                </button>
                                <button type="reset" className="user-account-btn user-account-btn-secondary">
                                    <FormattedMessage id="registration.reset" defaultMessage="Reset" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Registration;
