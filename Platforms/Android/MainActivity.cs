using Android.App;
using Android.Content.PM;
using Android.OS;
using Android.Views;
using AndroidX.Core.View;

namespace TetrioMaui;

[Activity(
    Theme = "@style/Maui.SplashTheme",
    MainLauncher = true,
    LaunchMode = LaunchMode.SingleTop,
    ScreenOrientation = ScreenOrientation.SensorLandscape,
    ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation | ConfigChanges.UiMode | ConfigChanges.ScreenLayout | ConfigChanges.SmallestScreenSize | ConfigChanges.Density)]
public class MainActivity : MauiAppCompatActivity
{
    protected override void OnCreate(Bundle? savedInstanceState)
    {
        base.OnCreate(savedInstanceState);
        RequestedOrientation = ScreenOrientation.SensorLandscape;
        HideNotificationBar();
    }

    protected override void OnResume()
    {
        base.OnResume();
        HideNotificationBar();
    }

    public override void OnWindowFocusChanged(bool hasFocus)
    {
        base.OnWindowFocusChanged(hasFocus);
        if (hasFocus)
        {
            HideNotificationBar();
        }
    }

    private void HideNotificationBar()
    {
        if (Window == null) return;

        // Ensure window fullscreen flags are set
        Window.AddFlags(WindowManagerFlags.Fullscreen);
        Window.ClearFlags(WindowManagerFlags.ForceNotFullscreen);

        // Modern Android (API 30+) insets controller
        if (Build.VERSION.SdkInt >= BuildVersionCodes.R)
        {
            WindowCompat.SetDecorFitsSystemWindows(Window, false);
            var controller = WindowCompat.GetInsetsController(Window, Window.DecorView);
            if (controller != null)
            {
                controller.Hide(WindowInsetsCompat.Type.StatusBars());
                controller.SystemBarsBehavior = WindowInsetsControllerCompat.BehaviorShowTransientBarsBySwipe;
            }
        }
        else
        {
#pragma warning disable CS0618
            Window.DecorView.SystemUiVisibility = (StatusBarVisibility)(
                SystemUiFlags.Fullscreen |
                SystemUiFlags.LayoutFullscreen |
                SystemUiFlags.LayoutStable |
                SystemUiFlags.ImmersiveSticky);
#pragma warning restore CS0618
        }
    }
}
