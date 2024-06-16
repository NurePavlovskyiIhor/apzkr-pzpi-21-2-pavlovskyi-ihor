using mobile_greenhouses.Views;
using mobile_greenhouses.Resources.Languages;

namespace mobile_greenhouses
{
    public partial class MainPage : ContentPage
    {
        int count = 0;

        public MainPage()
        {
            InitializeComponent();
            UpdateLocalization();
        }

        private async void LoginButton_Clicked(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new LoginPage());
        }

        private async void RegisterButton_Clicked(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new RegistrationPage());
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
            UpdateLocalization();
        }

        private void UpdateLocalization()
        {
            RegisterButton.Text = AppResources.RegisterButtonText;
            LoginButton.Text = AppResources.LoginButtonText;
            MainTitle.Text = AppResources.MainTitleText;
            MainDescription.Text = AppResources.MainDescriptionText;

        }

        private async void NavigateToLanguageSelection(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new LanguageSelectionPage());
        }
    }
}