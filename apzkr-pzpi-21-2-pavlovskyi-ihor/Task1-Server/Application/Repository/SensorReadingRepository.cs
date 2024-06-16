using Microsoft.EntityFrameworkCore;
using System.Linq;
using Application.Models;
using Application.DBContext;

namespace Application.Repositories
{
    public class SensorReadingRepository : ISensorReadingRepository
    {
        private readonly AppDbContext _dbContext;

        public SensorReadingRepository(AppDbContext context)
        {
            _dbContext = context;
        }

        public IQueryable<SensorReading> GetSensorReadings()
        {
            return _dbContext.SensorReading.Include(d => d.Sensor).AsQueryable();
        }

        public SensorReading GetSensorReadingById(int id)
        {
            return _dbContext.SensorReading.Include(d => d.Sensor).FirstOrDefault(d => d.SensorReadingId == id);
        }

        public List<SensorReading> GetSensorReadingsBySensorId(int sensorId)
        {
            return _dbContext.SensorReading
                .Where(sensorReading => sensorReading.Sensor.SensorId == sensorId)
                .ToList();
        }

        public void CreateSensorReading(SensorReading sensorReading)
        {
            _dbContext.SensorReading.Add(sensorReading);
            _dbContext.SaveChanges();
        }

        public void UpdateSensorReading(SensorReading sensorReading)
        {
            _dbContext.Entry(sensorReading).State = EntityState.Modified;
            _dbContext.SaveChanges();
        }

        public void DeleteSensorReading(int id)
        {
            var sensorReading = _dbContext.SensorReading.Find(id);
            if (sensorReading != null)
            {
                _dbContext.SensorReading.Remove(sensorReading);
                _dbContext.SaveChanges();
            }
        }
    }
}
