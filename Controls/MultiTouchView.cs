using Microsoft.Extensions.Logging;
using CommunityToolkit.Mvvm;
using CommunityToolkit.Maui;
using System.Windows.Input;
using TetrioMaui.Models;
using CommunityToolkit.Mvvm.Input;
using System.ComponentModel;

namespace TetrioMaui.Controls;

public interface IMultiTouchView : IView
{
    IList<ButtonConfig> ButtonConfigs { get; }
    IView? UnderlyingView { get; }
    void OnMultiTouchEvent(string s);
    void OnUpdateButton(int index, bool pressed);
}

[ContentProperty(nameof(ButtonConfigs))]
public class MultiTouchView : View, IMultiTouchView
{
    public static readonly BindableProperty MultiTouchCommandProperty = 
        BindableProperty.Create(
            propertyName: nameof(MultiTouchCommand),
            returnType: typeof(IRelayCommand<string>),
            declaringType: typeof(MultiTouchView),
            defaultValue: null
        );
    public IRelayCommand<string>? MultiTouchCommand
    {
        get => (IRelayCommand<string>?)GetValue(MultiTouchCommandProperty);
        set => SetValue(MultiTouchCommandProperty, value);
    }

    public static readonly BindableProperty UpdateButtonCommandProperty =
        BindableProperty.Create(
            propertyName: nameof(UpdateButtonCommand),
            returnType: typeof(IRelayCommand<(int, bool)>),
            declaringType: typeof(MultiTouchView),
            defaultValue: null
        );

    public IRelayCommand<(int, bool)>? UpdateButtonCommand
    {
        get => (IRelayCommand<(int, bool)>?)GetValue(UpdateButtonCommandProperty);
        set => SetValue(UpdateButtonCommandProperty, value);
    }

    public static readonly BindableProperty UnderlyingViewProperty =
        BindableProperty.Create(
            propertyName: nameof(UnderlyingView),
            returnType: typeof(IView),
            declaringType: typeof(MultiTouchView),
            defaultValue: null
        );

    public IView? UnderlyingView
    {
        get => (View?)GetValue(UnderlyingViewProperty);
        set => SetValue(UnderlyingViewProperty, value);
    }

    public static readonly BindableProperty ButtonConfigsProperty =
        BindableProperty.Create(
            propertyName: nameof(ButtonConfigs),
            returnType: typeof(IList<ButtonConfig>),
            declaringType: typeof(MultiTouchView),
            defaultValueCreator: _ => new List<ButtonConfig>()
        );

    public IList<ButtonConfig> ButtonConfigs
    {
        get => (IList<ButtonConfig>)GetValue(ButtonConfigsProperty);
        set => SetValue(ButtonConfigsProperty, value);
    }

    void IMultiTouchView.OnMultiTouchEvent(string s)
    {
        if (MultiTouchCommand?.CanExecute($"FLAZE OUTPUTTING THIS SHIT {s}") == true)
        {
            MultiTouchCommand.Execute($"FLAZE OUTPUTTING THIS SHIT{s}");
        }
    }

    void IMultiTouchView.OnUpdateButton(int index, bool pressed)
    {
        if (UpdateButtonCommand?.CanExecute((index, pressed)) == true)
        {
            UpdateButtonCommand.Execute((index, pressed));
        }
    }

}
