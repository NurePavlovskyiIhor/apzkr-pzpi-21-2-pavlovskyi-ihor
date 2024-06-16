using Application.Models;

namespace Application.Repositories
{
    public interface ISensorReadingRepository
    {
        IQueryable<SensorReading> GetSensorReadings();
        SensorReading GetSensorReadingById(int id);
        void CreateSensorReading(SensorReading sensorReading);
        void UpdateSensorReading(SensorReading sensorReading);
        void DeleteSensorReading(int animalId);
        List<SensorReading> GetSensorReadingsBySensorId(int sensorId);
    }
}
