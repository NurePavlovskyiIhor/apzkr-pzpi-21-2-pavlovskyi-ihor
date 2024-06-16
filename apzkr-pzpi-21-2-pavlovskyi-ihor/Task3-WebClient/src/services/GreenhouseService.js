import apiInstance from './ApiService';

export const getAllGreenhouses = async () => {
    try {
        const response = await apiInstance.get('/api/greenhouses');
        return response.data;
    } catch (error) {
        console.error('Error fetching greenhouses:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const deleteGreenhouse = async (greenhouseId) => {
    try {
        await apiInstance.delete(`/api/greenhouses/${greenhouseId}`);
    } catch (error) {
        console.error('Error deleting greenhouse:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateGreenhouse = async (greenhouseId, greenhouseData) => {
    try {
        if (!greenhouseId) throw new Error("Greenhouse ID is undefined");
        const response = await apiInstance.put(`/api/greenhouses/${greenhouseId}`, greenhouseData);
        console.log("Greenhouse updated successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating greenhouse:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const createGreenhouse = async (greenhouseData) => {
    try {
        const response = await apiInstance.post('/api/greenhouses', greenhouseData);
        return response.data;
    } catch (error) {
        console.error('Error creating greenhouse:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getGreenhouseByUserId = async (userId) => {
    try {
      const response = await apiInstance.get(`/api/greenhouses/byUserId/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching greenhouse by userId:', error);
      throw error;
    }
  };

  export const getGreenhouseById = async (id) => {
    try {
      const response = await apiInstance.get(`/api/greenhouses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching greenhouse by Id:', error);
      throw error;
    }
  };
