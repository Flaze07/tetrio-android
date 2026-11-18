using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Extensions.Logging;
using TetrioMaui.Models;

namespace TetrioMaui.ViewModel;

public partial class MainViewModel : ObservableObject
{
    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(CombinedButtons))]
    List<ButtonConfig> buttonConfigs =
        [
            new ButtonConfig
            {
                X = 200,
                Y = 200,
                Width = 100,
                Height = 100,
                IsTap = false,
            },
            new ButtonConfig
            {
                X = 350,
                Y = 200,
                Width = 100,
                Height = 100,
                IsTap = false,
            },
        ];

    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(CombinedButtons))]
    List<float> buttonOpacity =
        [
            1.0f,
            1.0f
        ];

    public List<ButtonVisualState> CombinedButtons =>
        ButtonConfigs
            .Zip(ButtonOpacity, (config, opacity) => new ButtonVisualState
            {
                Config = config,
                Opacity = opacity
            })
            .ToList();

    private ILogger<MainViewModel> _logger;
    public MainViewModel(ILogger<MainViewModel> logger)
    {
        _logger = logger;
        _logger.LogInformation("MainViewModel initialized");
    }
    
    [RelayCommand]
    void OnMultiTouch(string s)
    {
        _logger.LogInformation("{message}", s);
    }
    [RelayCommand]
    void OnUpdateButton((int index, bool pressed) args)
    {
        int index = args.index;
        bool pressed = args.pressed;
        ButtonOpacity[index] = pressed ? 0.5f : 1f;
        OnPropertyChanged(nameof(CombinedButtons));
    }
}