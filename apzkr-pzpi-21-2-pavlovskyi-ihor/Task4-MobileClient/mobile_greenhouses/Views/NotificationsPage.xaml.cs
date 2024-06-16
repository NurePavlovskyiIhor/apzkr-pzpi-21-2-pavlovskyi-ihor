using mobile_greenhouses.Resources.Languages;
using mobile_greenhouses.ViewModels;

namespace mobile_greenhouses.Views;

public partial class NotificationsPage : ContentPage
{
    private readonly NotificationViewModel _viewModel;

    public NotificationsPage()
    {
        InitializeComponent();
        _viewModel = new NotificationViewModel();
        BindingContext = _viewModel;
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        _viewModel.LoadNotificationsCommand.Execute(null);
        UpdateLocalization();
    }

    private void UpdateLocalization()
    {
        PageTitleLabel.Text = AppResources.NotificationsTitle;
        PageTitleTextLabel.Text = AppResources.NotificationsTitle;
        NotificationID.Text = AppResources.NotificationID;
        TitleLable.Text = AppResources.NotificationTitleLable;
        Message.Text = AppResources.NotificationMessage;
    }

    private async void NavigateToLanguageSelection(object sender, EventArgs e)
    {
        await Navigation.PushAsync(new LanguageSelectionPage());
    }
}
