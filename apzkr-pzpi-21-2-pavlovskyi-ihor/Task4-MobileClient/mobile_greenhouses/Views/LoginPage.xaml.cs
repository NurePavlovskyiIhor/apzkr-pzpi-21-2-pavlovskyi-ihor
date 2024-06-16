namespace mobile_greenhouses.Views;

using mobile_greenhouses.Resources.Languages;
using mobile_greenhouses.ViewModels;

public partial class LoginPage : ContentPage
{
	public LoginPage()
	{
		InitializeComponent();
        BindingContext = new LoginViewModel();
        UpdateLocalization();
    }
    protected override void OnAppearing()
    {
        base.OnAppearing();
        UpdateLocalization();
    }

    private void UpdateLocalization()
    {
        Title = AppResources.LoginButtonText;
        LoginEntry.Placeholder = AppResources.LoginPlaceholder;
        PasswordEntry.Placeholder = AppResources.PasswordPlaceholder;
        LoginButton.Text = AppResources.LoginButtonText;
    }
}