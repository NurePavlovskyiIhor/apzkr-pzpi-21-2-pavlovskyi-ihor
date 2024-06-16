// ViewModels/RegistrationViewModel.cs
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Text;
using mobile_greenhouses.Models;
using mobile_greenhouses.Services;
using Newtonsoft.Json;

namespace mobile_greenhouses.ViewModels
{
    public class RegistrationViewModel : INotifyPropertyChanged
    {
        private User user;
        private string password;
        private AuthService authService;

        public RegistrationViewModel()
        {
            user = new User();
            authService = new AuthService();
        }

        public string Password
        {
            get => password;
            set
            {
                if (password != value)
                {
                    password = value;
                    OnPropertyChanged();
                }
            }
        }

        public string Email
        {
            get => user.Email;
            set
            {
                if (user.Email != value)
                {
                    user.Email = value;
                    OnPropertyChanged();
                }
            }
        }

        public string UserName
        {
            get => user.UserName;
            set
            {
                if (user.UserName != value)
                {
                    user.UserName = value;
                    OnPropertyChanged();
                }
            }
        }

        public Command RegisterCommand => new Command(async () =>
        {
            var registrationData = new
            {
                password,
                email = user.Email,
                userName = user.UserName
            };

            var json = JsonConvert.SerializeObject(registrationData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var registeredUser = await authService.RegisterAsync(content);
            if (registeredUser != null)
            {
                await Shell.Current.GoToAsync("//LoginPage");
            }
            else
            {
                // Обробка помилки реєстрації
                await Application.Current.MainPage.DisplayAlert("Registration Error", "Failed to register user", "OK");
            }
        });

        public event PropertyChangedEventHandler PropertyChanged;

        protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}