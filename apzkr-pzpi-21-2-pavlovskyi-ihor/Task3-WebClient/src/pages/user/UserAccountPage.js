import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import '../../styles/user/accountPage.css';
import { AuthContext } from '../../contexts/AuthContext';
import { updateUser } from '../../services/UserService';

const UserAccountPage = () => {
    const { setUser, logout } = useContext(AuthContext);
    const [editingUser, setEditingUser] = useState(null);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const userData = localStorage.getItem('user');
    let user = userData ? JSON.parse(userData) : null;

    useEffect(() => {
        if (user) {
            setUserName(user.userName);
            setPassword(user.password);
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.clear();
            navigate('/');
            window.location.reload();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleEditUser = () => {
        setEditingUser({ ...user });
    };

    const handleUpdateUser = async () => {
        if (!/^[a-zA-Z\s]*$/.test(editingUser.userName)) {
            setErrors({ userName: "Full name should contain only letters." });
            return;
        }

        try {
            await updateUser(user.userId, editingUser);

            const updatedUser = {
                ...user,
                userName: editingUser.userName,
                password: editingUser.password,
            };

            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setEditingUser(null);
            setErrors({});
        } catch (error) {
            console.error('Error updating user:', error.response ? error.response.data : error.message);
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setErrors({});
    };

    return (
        <main className="user-account-main py-5">
            <div className="container">
                <h2 className="user-account-title">
                    <FormattedMessage
                        id="userAccountPage.title"
                        defaultMessage="User Account"
                    />
                </h2>
                <div className="user-account-info">
                    {user && (
                        <>
                            <p>
                                <strong>
                                    <FormattedMessage
                                        id="userAccountPage.userName"
                                        defaultMessage="User name:"
                                    />
                                </strong>{' '}
                                {editingUser ? (
                                    <input
                                        type="text"
                                        value={editingUser.userName}
                                        onChange={(e) =>
                                            setEditingUser({ ...editingUser, userName: e.target.value })
                                        }
                                        className="user-account-input-field"
                                    />
                                ) : (
                                    user.userName
                                )}
                                {errors.userName && <div className="user-account-error">{errors.userName}</div>}
                            </p>
                            <p>
                                <strong>
                                    <FormattedMessage
                                        id="userAccountPage.email"
                                        defaultMessage="Email:"
                                    />
                                </strong>{' '}
                                {editingUser ? (
                                    <input
                                        type="email"
                                        value={editingUser.email}
                                        onChange={(e) =>
                                            setEditingUser({ ...editingUser, email: e.target.value })
                                        }
                                        className="user-account-input-field"
                                    />
                                ) : (
                                    user.email
                                )}
                            </p>
                        </>
                    )}
                    <div className="user-account-btn-group">
                        {editingUser ? (
                            <>
                                <button className="user-account-btn user-account-btn-primary" onClick={handleUpdateUser}>
                                    <FormattedMessage id="userAccountPage.saveChanges" defaultMessage="Save Changes" />
                                </button>
                                <button className="user-account-btn user-account-btn-secondary" onClick={handleCancelEdit}>
                                    <FormattedMessage id="userAccountPage.cancel" defaultMessage="Cancel" />
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="user-account-btn user-account-btn-primary" onClick={handleEditUser}>
                                    <FormattedMessage id="userAccountPage.editAccount" defaultMessage="Edit Account" />
                                </button>
                                <button className="user-account-btn user-account-btn-danger" onClick={handleLogout}>
                                    <FormattedMessage id="userAccountPage.logout" defaultMessage="Logout" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default UserAccountPage;
