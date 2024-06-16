using Microsoft.EntityFrameworkCore;
using System.Linq;
using Application.Models;
using Application.DBContext;

namespace Application.Repositories
{
    public class ScheduleRepository : IScheduleRepository
    {
        private readonly AppDbContext _dbContext;

        public ScheduleRepository(AppDbContext context)
        {
            _dbContext = context;
        }
        public IQueryable<Schedule> GetSchedules()
        {
            return _dbContext.Schedule;
        }

        public Schedule GetScheduleById(int id)
        {
            return _dbContext.Schedule.Find(id);
        }

        public List<Schedule> GetScheduleBySensorId(int sensorId)
        {
            return _dbContext.Schedule
                .Where(schedule => schedule.Sensor.SensorId == sensorId)
                .ToList();
        }

        public void CreateSchedule(Schedule schedule)
        {
            _dbContext.Schedule.Add(schedule);
            _dbContext.SaveChanges();
        }

        public void UpdateSchedule(Schedule schedule)
        {
            _dbContext.Entry(schedule).State = EntityState.Modified;
            _dbContext.SaveChanges();
        }

        public void DeleteSchedule(int id)
        {
            var schedule = _dbContext.Schedule.Find(id);
            if (schedule != null)
            {
                _dbContext.Schedule.Remove(schedule);
                _dbContext.SaveChanges();
            }
        }
    }
}
