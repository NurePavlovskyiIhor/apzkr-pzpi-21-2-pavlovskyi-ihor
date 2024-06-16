using Microsoft.EntityFrameworkCore;
using System.Linq;
using Application.Models;
using Application.DBContext;

namespace Application.Repositories
{
    public class SensorRepository : ISensorRepository
    {
        private readonly AppDbContext _dbContext;

        public SensorRepository(AppDbContext context)
        {
            _dbContext = context;
        }

        public IQueryable<Sensor> GetSensors()
        {
            return _dbContext.Sensor.Include(d => d.Greenhouse).AsQueryable();
        }

        public Sensor GetSensorById(int id)
        {
            return _dbContext.Sensor.Include(d => d.Greenhouse).FirstOrDefault(d => d.SensorId == id);
        }

        public List<Sensor> GetSensorsByGreenhouseId(int greenhouseId)
        {
            return _dbContext.Sensor
                .Where(sensor => sensor.Greenhouse.GreenhouseId == greenhouseId)
                .ToList();
        }

        public void CreateSensor(Sensor sensor)
        {
            _dbContext.Sensor.Add(sensor);
            _dbContext.SaveChanges();
        }

        public void UpdateSensor(Sensor sensor)
        {
            _dbContext.Entry(sensor).State = EntityState.Modified;
            _dbContext.SaveChanges();
        }

        public void DeleteSensor(int id)
        {
            var sensor = _dbContext.Sensor.Find(id);
            if (sensor != null)
            {
                _dbContext.Sensor.Remove(sensor);
                _dbContext.SaveChanges();
            }
        }
    }
}
