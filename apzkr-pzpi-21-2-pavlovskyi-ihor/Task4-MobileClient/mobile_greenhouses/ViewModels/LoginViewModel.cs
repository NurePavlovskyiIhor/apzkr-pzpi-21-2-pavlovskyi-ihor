// ViewModels/LoginViewModel.cs
using System.ComponentModel;
using System.Runtime.CompilerServices;
//using mobile_greenhouses.Enums;
using mobile_greenhouses.Models;
using mobile_greenhouses.Services;

namespace mobile_greenhouses.ViewModels
{
    public class LoginViewModel : INotifyPropertyChanged
    {
        private LoginCredentials credentials;
        private AuthService authService;

        public LoginViewModel()
        {
            credentials = new LoginCredentials();
            authService = new AuthService();
        }

        public string Login
        {
            get => credentials.Email;
            set
            {
                if (credentials.Email != value)
                {
                    credentials.Email = value;
                    OnPropertyChanged();
                }
            }
        }

        public string Password
        {
            get => credentials.Password;
            set
            {
                if (credentials.Password != value)
                {
                    credentials.Password = value;
                    OnPropertyChanged();
                }
            }
        }

        public bool RememberMe
        {
            get => credentials.RememberMe;
            set => credentials.RememberMe = true;
        }

        public Command LoginCommand => new Command(async () =>
        {
            var user = await authService.LoginAsync(credentials);
            if (user != null)
            {

                await Shell.Current.GoToAsync("//UserTab/UserAccountPage");

                // Успішна авторизація, перехід на відповідну сторінку в залежності від ролі користувача
                //if (user.Role == Role.User)
                //{
                //    await Shell.Current.GoToAsync("//UserTab/UserAccountPage");
                //}
                //else if (user.Role == Role.Admin)
                //{
                //    await Shell.Current.GoToAsync("//AdminTab/AdminAccountPage");
                //}
            }
            else
            {
                // Обробка помилки авторизації
                await Application.Current.MainPage.DisplayAlert("Login Error", "Invalid login or password", "OK");
            }
        });

        public event PropertyChangedEventHandler PropertyChanged;

        protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}