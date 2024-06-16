import apiInstance from './ApiService';

export const getSchedulesBySensorId = async (sensorId) => {
    try {
        const response = await apiInstance.get(`/api/schedules/bySensorId/${sensorId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching schedules by sensorId:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const addSchedule = async (scheduleData) => {
    try {
        const response = await apiInstance.post('/api/schedules', scheduleData);
        return response.data;
    } catch (error) {
        console.error('Error adding schedule:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const deleteSchedule = async (scheduleId) => {
    try {
        await apiInstance.delete(`/api/schedules/${scheduleId}`);
    } catch (error) {
        console.error('Error deleting schedule:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateSchedule = async (scheduleId, scheduleData) => {
    try {
        if (!scheduleId) throw new Error("Schedule ID is undefined");

        const response = await apiInstance.put(`/api/schedules/${scheduleId}`, scheduleData);
        console.log("Schedule updated successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating schedule:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getScheduleById = async (id) => {
    try {
      const response = await apiInstance.get(`/api/schedules/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching schedule by Id:', error);
      throw error;
    }
  };