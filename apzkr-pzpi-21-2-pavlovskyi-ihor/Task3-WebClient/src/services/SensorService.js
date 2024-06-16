import apiInstance from './ApiService';

export const getSensorsByGreenhouseId = async (greenhouseId) => {
    try {
        const response = await apiInstance.get(`/api/sensors/byGreenhouseId/${greenhouseId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching sensors by greenhouseId:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getSensorsByUserId = async (userId) => {
    try {
        const response = await apiInstance.get(`/api/sensors/byUserId/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching sensors by userId:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const addSensor = async (sensorData) => {
    try {
        const response = await apiInstance.post('/api/sensors', sensorData);
        return response.data;
    } catch (error) {
        console.error('Error adding sensor:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getSensorById = async (id) => {
    try {
      const response = await apiInstance.get(`/api/sensors/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sensor by Id:', error);
      throw error;
    }
  };

  export const deleteSensor = async (sensorId) => {
    try {
        await apiInstance.delete(`/api/sensors/${sensorId}`);
    } catch (error) {
        console.error('Error deleting sensor:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateSensor = async (sensorId, sensorData) => {
    try {
        if (!sensorId) throw new Error("Sensor ID is undefined");

        const response = await apiInstance.put(`/api/sensors/${sensorId}`, sensorData);
        console.log("Sensor updated successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating Sensor:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getSensors = async () => {
    try {
        await apiInstance.get(`/api/sensors/`);
    } catch (error) {
        console.error('Error getting sensors:', error.response ? error.response.data : error.message);
        throw error;
    }
};