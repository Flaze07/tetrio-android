using Microsoft.Extensions.DependencyInjection;

namespace TetrioMaui;

public partial class App : Application
{
	public App()
	{
		InitializeComponent();
	}

	protected override Window CreateWindow(IActivationState? activationState)
	{
		var window = new Window(new AppShell());
		window.Width = 1280;
		window.Height = 720;
		return window;
	}
}
