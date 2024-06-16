using Application.Models;

namespace Application.Repositories
{
    public interface ISensorRepository
    {
        IQueryable<Sensor> GetSensors();
        Sensor GetSensorById(int id);
        void CreateSensor(Sensor sensor);
        void UpdateSensor(Sensor sensor);
        void DeleteSensor(int id);
        List<Sensor> GetSensorsByGreenhouseId(int sensorId);
    }
}
