#if ANDROID
using Android.Content.PM;
#endif
using Microsoft.Extensions.Logging;
using Microsoft.Maui.LifecycleEvents;
using TetrioMaui.Controls;
using CommunityToolkit.Maui;
using TetrioMaui.ViewModel;

namespace TetrioMaui;
public static class MauiProgram
{
#if ANDROID
    private static void HideStatusBar()
    {
        var activity = Platform.CurrentActivity;
        if (activity is null)
        {
            return;
        }

        activity.RequestedOrientation = ScreenOrientation.Landscape;
        var window = activity.Window;
        if (window is null)
        {
            return;
        }

        var controller = AndroidX.Core.View.WindowCompat.GetInsetsController(window, window.DecorView);
        if (controller is null)
        {
            return;
        }

        AndroidX.Core.View.WindowCompat.SetDecorFitsSystemWindows(window, false);
        controller.Hide(AndroidX.Core.View.WindowInsetsCompat.Type.StatusBars());
        controller.SystemBarsBehavior = AndroidX.Core.View.WindowInsetsControllerCompat.BehaviorShowTransientBarsBySwipe;
    }

#endif
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder.UseMauiApp<App>().UseMauiCommunityToolkit().ConfigureLifecycleEvents(events =>
        {
#if ANDROID
            events.AddAndroid(android => android.OnCreate((_, _) => HideStatusBar()).OnResume(_ => HideStatusBar()));
#endif
        }).ConfigureMauiHandlers(handlers =>
        {
            handlers.AddHandler<MultiTouchView, MultiTouchViewHandler>();
        }).ConfigureFonts(fonts =>
        {
            fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
            fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
        });
#if DEBUG
        builder.Logging.ClearProviders();
        builder.Logging.AddDebug();
        builder.Logging.AddSimpleConsole(options =>
        {
            options.SingleLine = true;
            options.TimestampFormat = "HH:mm:ss";
            options.ColorBehavior = Microsoft.Extensions.Logging.Console.LoggerColorBehavior.Disabled;
        });
        builder.Logging.SetMinimumLevel(LogLevel.Trace);
        builder.Logging.AddFilter("Microsoft", LogLevel.Warning);
        builder.Logging.AddFilter("System", LogLevel.Warning);
#endif
        builder.Services.AddSingleton<MainPage>();
        builder.Services.AddSingleton<MainViewModel>();

        return builder.Build();
    }
}