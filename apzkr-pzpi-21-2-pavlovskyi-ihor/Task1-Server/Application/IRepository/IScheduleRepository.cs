using Application.Models;

namespace Application.Repositories
{
    public interface IScheduleRepository
    {
        IQueryable<Schedule> GetSchedules();
        Schedule GetScheduleById(int id);
        void CreateSchedule(Schedule schedule);
        void UpdateSchedule(Schedule schedule);
        void DeleteSchedule(int id);
        List<Schedule> GetScheduleBySensorId(int sensorId);
    }
}
