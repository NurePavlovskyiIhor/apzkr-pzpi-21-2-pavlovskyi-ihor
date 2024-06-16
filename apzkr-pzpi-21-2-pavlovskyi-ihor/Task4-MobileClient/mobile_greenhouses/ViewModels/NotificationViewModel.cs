using mobile_greenhouses.Models;
using mobile_greenhouses.Services;
using System.Collections.ObjectModel;
using System.Windows.Input;

namespace mobile_greenhouses.ViewModels
{
    public class NotificationViewModel
    {
        private readonly NotificationService _notificationService;
        private readonly AuthService _authService;

        public ObservableCollection<Notification> Notifications { get; }
        public ICommand LoadNotificationsCommand { get; }

        public NotificationViewModel()
        {
            _notificationService = new NotificationService();
            _authService = new AuthService();
            Notifications = new ObservableCollection<Notification>();
            LoadNotificationsCommand = new Command(async () => await LoadNotifications());
        }

        private async Task LoadNotifications()
        {
            var user = _authService.GetUser();
            if (user != null)
            {
                var history = await _notificationService.GetUserNotifications(user.UserId);
                Notifications.Clear();

                foreach (var item in history)
                {
                    Notifications.Add(item);
                }
            }
        }
    }
}