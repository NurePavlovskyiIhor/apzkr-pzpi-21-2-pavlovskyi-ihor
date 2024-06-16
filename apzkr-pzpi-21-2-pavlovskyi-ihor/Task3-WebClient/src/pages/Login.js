import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import '../styles/login.css';
import { AuthContext } from '../contexts/AuthContext';
import { login as loginUser } from '../services/AuthService';
import LoginCredentials from '../models/LoginCredentials';
import { getUserByEmail } from '../services/UserService';

const Login = () => {
    const [credentials, setCredentials] = useState(new LoginCredentials('', '', true));
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await loginUser(credentials);
            if (userData) {
                login(userData);
                localStorage.clear();
                const user = await getUserByEmail(credentials.email);
                const id = user?.id;
                localStorage.setItem('user', JSON.stringify(userData));
                navigate('/user');
                window.location.reload();
            } else {
                console.error('Invalid user data:', userData);
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <main className="user-account-main">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <h2 className="user-account-title">
                            <FormattedMessage id="login.title" defaultMessage="Login" />
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="user-account-info">
                                <label htmlFor="login" className="user-account-label">
                                    <FormattedMessage id="login.title" defaultMessage="Login" />
                                </label>
                                <input
                                    type="email"
                                    className="user-account-input-field"
                                    id="login"
                                    name="email"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="user-account-info">
                                <label htmlFor="password" className="user-account-label">
                                    <FormattedMessage id="login.password" defaultMessage="Password" />
                                </label>
                                <input
                                    type="password"
                                    className="user-account-input-field"
                                    id="password"
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="user-account-btn-group">
                                <button type="submit" className="user-account-btn user-account-btn-primary">
                                    <FormattedMessage id="login.submit" defaultMessage="Login" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Login;
