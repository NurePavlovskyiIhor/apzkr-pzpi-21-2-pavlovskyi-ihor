using mobile_greenhouses.Resources.Languages;
using mobile_greenhouses.ViewModels;

namespace mobile_greenhouses.Views;

public partial class GreenhousesPage : ContentPage
{
    private readonly GreenhouseViewModel _viewModel;

    public GreenhousesPage()
    {
        InitializeComponent();
        _viewModel = new GreenhouseViewModel();
        BindingContext = _viewModel;
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        _viewModel.LoadGreenhousesCommand.Execute(null);
        UpdateLocalization();
    }

    private void UpdateLocalization()
    {
        PageTitleLabel.Text = AppResources.GreenhouseTitle;
        PageTitleTextLabel.Text = AppResources.GreenhouseTitle;
        GreenhouseID.Text = AppResources.GreenhouseID;
        Name.Text = AppResources.GreenhouseName;
    }

    private async void NavigateToLanguageSelection(object sender, EventArgs e)
    {
        await Navigation.PushAsync(new LanguageSelectionPage());
    }
}
