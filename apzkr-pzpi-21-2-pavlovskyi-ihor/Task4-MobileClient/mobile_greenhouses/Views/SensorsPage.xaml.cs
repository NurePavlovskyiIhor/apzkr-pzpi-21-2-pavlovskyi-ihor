using mobile_greenhouses.Resources.Languages;
using mobile_greenhouses.ViewModels;

namespace mobile_greenhouses.Views;

public partial class SensorsPage : ContentPage
{
    private readonly SensorViewModel _viewModel;

    public SensorsPage()
    {
        InitializeComponent();
        _viewModel = new SensorViewModel();
        BindingContext = _viewModel;
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        _viewModel.LoadSensorsCommand.Execute(null);
        UpdateLocalization();
    }

    private void UpdateLocalization()
    {
        PageTitleLabel.Text = AppResources.SensorTitle;
        PageTitleTextLabel.Text = AppResources.SensorTitle;
        SensorID.Text = AppResources.SensorID;
        SensorType.Text = AppResources.SensorType;
        MinValue.Text = AppResources.SensorMinValue;
        MaxValue.Text = AppResources.SensorMaxValue;
        IsActive.Text = AppResources.SensorIsActive;
    }

    private async void NavigateToLanguageSelection(object sender, EventArgs e)
    {
        await Navigation.PushAsync(new LanguageSelectionPage());
    }
}
