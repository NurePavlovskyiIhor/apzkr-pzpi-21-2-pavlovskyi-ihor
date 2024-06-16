using mobile_greenhouses.Models;
using mobile_greenhouses.Resources.Languages;
using mobile_greenhouses.Services;

namespace mobile_greenhouses.Views;

public partial class EditUserPage : ContentPage
{
    private readonly AuthService _authService;
    private User _user;
    public Command BackCommand { get; }

    public EditUserPage()
    {
        InitializeComponent();
        _authService = new AuthService();
        BackCommand = new Command(async () => await GoBack());
        BindingContext = this;
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        LoadUserData();
        UpdateLocalization();
    }

    private async Task GoBack()
    {
        await Shell.Current.GoToAsync("..");
    }

    private void LoadUserData()
    {
        _user = _authService.GetUser();
        if (_user != null)
        {
            UserNameEntry.Text = _user.UserName;
            EmailEntry.Text = _user.Email;
        }
    }

    private void UpdateLocalization()
    {
        Title = AppResources.EditUserTitle;
        PageTitleLabel.Text = AppResources.EditUserTitle;
        UserNameLabelTitle.Text = AppResources.UserNameLabelTitle;
        EmailLabelTitle.Text = AppResources.EmailLabelTitle;
        SaveChangesButton.Text = AppResources.SaveChangesButtonText;
        GoBackButton.Text = AppResources.GoBackButtonText;
    }

    private async void SaveChangesButton_Clicked(object sender, EventArgs e)
    {
        _user.UserName = UserNameEntry.Text;
        _user.Email = EmailEntry.Text;

        var isUpdateSuccessful = await _authService.UpdateUserAsync(_user.UserId, _user);
        if (isUpdateSuccessful)
        {
            await DisplayAlert(AppResources.SuccessTitle, AppResources.AccountUpdatedSuccessMessage, "OK");
            _authService.SaveUser(_user);
            await Shell.Current.GoToAsync("//UserTab/UserAccountPage");
        }
        else
        {
            await DisplayAlert(AppResources.ErrorTitle, AppResources.AccountUpdateErrorMessage, "OK");
        }
    }

    private async void GoBackButton_Clicked(object sender, EventArgs e)
    {
        await Shell.Current.GoToAsync("//UserTab/UserAccountPage");
    }
}