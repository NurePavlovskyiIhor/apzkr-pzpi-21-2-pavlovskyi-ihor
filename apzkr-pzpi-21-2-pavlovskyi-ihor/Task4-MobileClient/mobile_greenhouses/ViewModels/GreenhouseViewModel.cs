using mobile_greenhouses.Models;
using mobile_greenhouses.Services;
using System.Collections.ObjectModel;
using System.Windows.Input;

namespace mobile_greenhouses.ViewModels
{
    public class GreenhouseViewModel
    {
        private readonly GreenhouseService _greenhouseService;
        private readonly AuthService _authService;

        public ObservableCollection<Greenhouse> Greenhouses { get; }
        public ICommand LoadGreenhousesCommand { get; }

        public GreenhouseViewModel()
        {
            _greenhouseService = new GreenhouseService();
            _authService = new AuthService();
            Greenhouses = new ObservableCollection<Greenhouse>();
            LoadGreenhousesCommand = new Command(async () => await LoadGreenhouses());
        }

        private async Task LoadGreenhouses()
        {
            var user = _authService.GetUser();
            if (user != null)
            {
                var history = await _greenhouseService.GetUserGreenhouses(user.UserId);
                Greenhouses.Clear();

                foreach (var item in history)
                {
                    Greenhouses.Add(item);
                }
            }
        }
    }
}