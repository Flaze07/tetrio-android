using Microsoft.Extensions.Logging;
using TetrioMaui.ViewModel;

namespace TetrioMaui;

public partial class MainPage : ContentPage
{
    public MainPage(MainViewModel vm)
    {
        InitializeComponent();
        BindingContext = vm;
    }
}
