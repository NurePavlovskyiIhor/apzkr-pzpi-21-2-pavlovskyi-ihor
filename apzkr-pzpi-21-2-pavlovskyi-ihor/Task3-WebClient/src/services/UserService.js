import apiInstance from './ApiService';

export const getAllUsers = async () => {
    try {
        const response = await apiInstance.get('/api/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        await apiInstance.delete(`/api/users/${userId}`);
    } catch (error) {
        console.error('Error deleting user:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateUser = async (userId, userData) => {
    try {
        if (!userId) throw new Error("User ID is undefined");
        const response = await apiInstance.put(`/api/users/${userId}`, userData);
        console.log("User updated successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const createUser = async (userData) => {
    try {
        const response = await apiInstance.post('/api/users', userData);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getUserByEmail = async (email) => {
    try {
      const response = await apiInstance.get(`/api/users/byEmail/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  };