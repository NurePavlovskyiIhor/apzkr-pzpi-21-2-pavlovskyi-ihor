using Application.Models;

namespace Application.Repositories
{
    public interface INotificationRepository
    {
        IQueryable<Notification> GetNotifications();
        Notification GetNotificationById(int id);
        void CreateNotification(Notification notification);
        void UpdateNotification(Notification notification);
        void DeleteNotification(int id);
        List<Notification> GetNotificationsBySensorId(int sensorId);
    }
}
