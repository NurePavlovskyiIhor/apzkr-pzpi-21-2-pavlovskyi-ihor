import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './contexts/AuthContext';
import { FormattedMessage } from 'react-intl';
import { AuthContext } from './contexts/AuthContext';
import { IntlProvider } from 'react-intl';
import { LanguageContext } from './contexts/LanguageContext';
import en from './locales/en.json';
import uk from './locales/ua.json';

import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Contacts from './pages/Contacts';
import Registration from './pages/Registration';
import Login from './pages/Login';

import GreenhousesPage from "./pages/user/GreenhousesPage"
import AddGreenhousePage from "./pages/user/AddGreenhousePage"
import EditGreenhousePage from "./pages/user/EditGreenhousePage"

import SensorsPage from "./pages/user/SensorsPage"
import AddSensorPage from "./pages/user/AddSensorPage"
import EditSensorPage from "./pages/user/EditSensorPage"

import NotificationsPage from "./pages/user/NotificationsPage"

import SchedulesPage from "./pages/user/SchedulesPage"
import AddSchedulePage from "./pages/user/AddSchedulePage"
import EditSchedulePage from "./pages/user/EditSchedulePage"

import UserHomePage from './pages/user/UserHomePage';
import UserAccountPage from './pages/user/UserAccountPage';


const messages = {
    en,
    uk,
};

function App() {
    const { language } = useContext(LanguageContext);

    const user = JSON.parse(localStorage.getItem('user'));

    const renderHeader = () => {
        if (user) {
            return (
                <Header
                    title={<FormattedMessage id="userHeader.title" defaultMessage="User" />}
                    navigationItems={[
                        { id: 'home', path: '/user', labelId: 'userHeader.home', defaultLabel: 'Home' },
                        { id: 'greenhousesPage', path: '/user/greenhouses', labelId: 'userHeader.greenhousesPage', defaultLabel: 'Greenhouses' },
                        { id: 'notificationsPage', path: '/user/notifications', labelId: 'userHeader.notificationsPage', defaultLabel: 'Notifications' },
                    ]}
                    accountButton={{ path: '/user/account', labelId: 'userHeader.account', defaultLabel: 'Account' }}
                />
            );
        } else {
            return (
                <Header
                    title={<FormattedMessage id="app.title" defaultMessage="Greenhouses" />}
                    navigationItems={[
                        { id: 'home', path: '/', labelId: 'app.home', defaultLabel: 'Home' },
                        { id: 'about', path: '/about', labelId: 'app.about', defaultLabel: 'About' },
                        { id: 'contacts', path: '/contacts', labelId: 'app.contacts', defaultLabel: 'Contacts' },
                    ]}
                    authButtons={[
                        { id: 'login', path: '/login', labelId: 'app.login', defaultLabel: 'Login' },
                        { id: 'register', path: '/registration', labelId: 'app.register', defaultLabel: 'Register' },
                    ]}
                />
            );
        }
    };

    return (
        <AuthProvider>
            <IntlProvider messages={messages[language]} locale={language} defaultLocale="en">
                <Router>
                    <div className="app">
                        {renderHeader()}
                        <Routes>
                            <Route exact path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contacts" element={<Contacts />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/registration" element={<Registration />} />

                            <Route path="/user" element={<UserHomePage />}/>
                            <Route path="/user/account" element={<UserAccountPage />} />

                            <Route path="/user/greenhouses" element={<GreenhousesPage />} />
                            <Route path="/user/addGreenhouse" element={<AddGreenhousePage />} />
                            <Route path="/user/editGreenhouse/:greenhouseId" element={<EditGreenhousePage />} />

                            <Route path="/user/sensors/:greenhouseId" element={<SensorsPage/>} />
                            <Route path="/user/addSensor" element={<AddSensorPage />} />
                            <Route path="/user/editSensor/:sensorId" element={<EditSensorPage />} />

                            <Route path="/user/notifications" element={<NotificationsPage />} />

                            <Route path="/user/schedules/:sensorId" element={<SchedulesPage />} />
                            <Route path="/user/addSchedule/:sensorId" element={<AddSchedulePage />} />
                            <Route path="/user/editSchedule/:scheduleId" element={<EditSchedulePage />} />
                        </Routes>
                    </div>
                </Router>
            </IntlProvider>
        </AuthProvider>
    );
}

export default App;