using CommunityToolkit.Mvvm.ComponentModel;

namespace TetrioMaui.Models;

public partial class ButtonVisualState : ObservableObject
{
    public required ButtonConfig Config { get; init; }
    
    [ObservableProperty]
    private float _opacity;
}
