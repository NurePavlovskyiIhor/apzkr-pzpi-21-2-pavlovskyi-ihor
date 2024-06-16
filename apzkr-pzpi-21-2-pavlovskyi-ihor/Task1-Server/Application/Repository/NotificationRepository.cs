using Microsoft.EntityFrameworkCore;
using System.Linq;
using Application.Models;
using Application.DBContext;

namespace Application.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly AppDbContext _dbContext;

        public NotificationRepository(AppDbContext context)
        {
            _dbContext = context;
        }

        public IQueryable<Notification> GetNotifications()
        {
            return _dbContext.Notification.Include(d => d.SensorReading).AsQueryable();
        }

        public Notification GetNotificationById(int id)
        {
            return _dbContext.Notification.Include(d => d.SensorReading).FirstOrDefault(d => d.NotificationId == id);
        }

        public List<Notification> GetNotificationsBySensorId(int sensorId)
        {
            return _dbContext.Notification
                .Where(notification => notification.SensorReading.SensorReadingId == sensorId)
                .ToList();
        }

        public void CreateNotification(Notification notification)
        {
            _dbContext.Notification.Add(notification);
            _dbContext.SaveChanges();
        }

        public void UpdateNotification(Notification notification)
        {
            _dbContext.Entry(notification).State = EntityState.Modified;
            _dbContext.SaveChanges();
        }

        public void DeleteNotification(int id)
        {
            var notification = _dbContext.Notification.Find(id);
            if (notification != null)
            {
                _dbContext.Notification.Remove(notification);
                _dbContext.SaveChanges();
            }
        }
    }
}
