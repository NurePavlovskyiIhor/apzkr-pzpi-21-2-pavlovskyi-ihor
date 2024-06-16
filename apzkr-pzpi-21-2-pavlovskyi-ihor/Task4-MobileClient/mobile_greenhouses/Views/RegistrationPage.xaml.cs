namespace mobile_greenhouses.Views;

using mobile_greenhouses.Resources.Languages;
using mobile_greenhouses.ViewModels;
using Microsoft.Extensions.Logging.Abstractions;

public partial class RegistrationPage : ContentPage
{
	public RegistrationPage()
	{
		InitializeComponent();
        BindingContext = new RegistrationViewModel();
        UpdateLocalization();
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        UpdateLocalization();
    }

    private void UpdateLocalization()
    {
        Title = AppResources.RegisterButtonText;
        PasswordEntry.Placeholder = AppResources.PasswordPlaceholder;
        EmailEntry.Placeholder = AppResources.EmailPlaceholder;
        UserNameEntry.Placeholder = AppResources.UserNamePlaceholder;
        RegisterButton.Text = AppResources.RegisterButtonText;
    }
}