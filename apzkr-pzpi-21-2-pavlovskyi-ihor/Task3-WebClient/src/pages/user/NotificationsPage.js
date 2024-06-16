import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import '../../styles/user/notifications.css';
import { useNavigate } from 'react-router-dom';
import { getNotificationsByUserId, deleteNotification } from '../../services/NotificationService';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const notifications = await getNotificationsByUserId(user.userId);
                setNotifications(notifications);
                console.log(notifications);
                if (notifications.length === 0) {
                    setError("No notifications found.");
                } else {
                    setError(null);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setError('Failed to fetch notifications');
            } finally {
                setIsLoading(false);
            }
        };

        if (user && user.userId) {
            fetchNotifications();
        } else {
            setIsLoading(false);
            setError("User not found.");
        }
    }, [user?.userId]);

    const handleDeleteNotification = async (notificationId) => {
        try {
            await deleteNotification(notificationId);
            let data = await getNotificationsByUserId(user.userId);
            setNotifications(data);
        } catch (error) {
            console.error('Error deleting notifications:', error);
            setError('Failed to delete notifications');
        }
    };

    return (
      <main className="notifications-page main py-5">
        <div className="notifications-page container">
          <div className="notifications-page row">
              <div className="notifications-page col">
                  <h1 className="notifications-page page-title">
                      <FormattedMessage id="notificationsPage.title" defaultMessage="Notifications" />
                  </h1>
              </div>
          </div>
            {notifications.length === 0 ? (
                <div>No notifications found.</div>
            ) : (
                <table className="notifications-page table-notifications">
                    <thead>
                        <tr>
                            <th><FormattedMessage id="notificationPage.ID" defaultMessage="ID" /></th>
                            <th><FormattedMessage id="notificationPage.Title2" defaultMessage="Title" /></th>
                            <th><FormattedMessage id="notificationPage.Message" defaultMessage="Message" /></th>
                            <th><FormattedMessage id="notificationPage.Timestamp" defaultMessage="Timestamp" /></th>
                            <th><FormattedMessage id="notificationPage.GreenhouseName" defaultMessage="Greenhouse Name" /></th>
                            <th><FormattedMessage id="notificationPage.Action" defaultMessage="Action" /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map(notification => (
                            <tr key={notification.notificationId}>
                                <td>{notification.notificationId}</td>
                                <td>{notification.title}</td>
                                <td>{notification.message}</td>
                                <td>{new Date(notification.sensorReading.timestamp).toISOString().replace('T', ' ').substr(0, 19)}</td>
                                <td>{notification.sensorReading.sensor.greenhouse.name}</td>
                                <td>
                                    <button
                                        onClick={() => handleDeleteNotification(notification.notificationId)}
                                        className="notifications-page btn-delete-notification"
                                    >
                                        <FormattedMessage id="notificationPage.Delete" defaultMessage="Delete" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </main>
    );
};

export default NotificationsPage;
