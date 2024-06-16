using mobile_greenhouses.Resources.Languages;
using mobile_greenhouses.Views;


namespace mobile_greenhouses
{
    public partial class AppShell : Shell
    {
        public AppShell()
        {
            InitializeComponent();
            UpdateLocalization();
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
            UpdateLocalization();
        }

        private async void NavigateToLanguageSelection(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new LanguageSelectionPage());
        }

        private void UpdateLocalization()
        {
            GreenhousesTab.Title = AppResources.GreenhousesTitle;
            NotificationsTab.Title = AppResources.NotificationsTitle;
            UserAccountTab.Title = AppResources.UserAccountTitle;
            SensorsTab.Title = AppResources.SensorsTitle;
        }
    }
}
