import apiInstance from './ApiService';

export const getNotificationsByUserId = async (userId) => {
    try {
      const response = await apiInstance.get(`/api/notifications/byUserId/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications by userId:', error);
      throw error;
    }
};

export const deleteNotification = async (notificationId) => {
    try {
        await apiInstance.delete(`/api/notifications/${notificationId}`);
    } catch (error) {
        console.error('Error deleting notification:', error.response ? error.response.data : error.message);
        throw error;
    }
};