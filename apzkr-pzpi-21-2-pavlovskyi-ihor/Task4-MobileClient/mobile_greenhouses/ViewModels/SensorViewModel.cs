using mobile_greenhouses.Models;
using mobile_greenhouses.Services;
using System.Collections.ObjectModel;
using System.Windows.Input;

namespace mobile_greenhouses.ViewModels
{
    public class SensorViewModel
    {
        private readonly SensorService _sensorService;
        private readonly AuthService _authService;

        public ObservableCollection<Sensor> Sensors { get; }
        public ICommand LoadSensorsCommand { get; }

        public SensorViewModel()
        {
            _sensorService = new SensorService();
            _authService = new AuthService();
            Sensors = new ObservableCollection<Sensor>();
            LoadSensorsCommand = new Command(async () => await LoadSensors());
        }

        private async Task LoadSensors()
        {
            var user = _authService.GetUser();
            if (user != null)
            {
                var history = await _sensorService.GetUserSensors(user.UserId);
                Sensors.Clear();

                foreach (var item in history)
                {
                    Sensors.Add(item);
                }
            }
        }
    }
}