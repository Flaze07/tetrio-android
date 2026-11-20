using Android.Bluetooth;
using Android.Content;
using Android.Media.Metrics;
using Android.Util;
using Android.Views;
using Microsoft.Maui.Handlers;
using Microsoft.Maui.Platform;
using TetrioMaui.Models;
using PlatformView = Android.Views.View;

namespace TetrioMaui.Controls;

abstract record PressStatus
{

    private PressStatus() {}
    public sealed record PressedTap(List<long> Id): PressStatus;
    public sealed record Pressed: PressStatus;
    public sealed record None: PressStatus;
}

public partial class MultiTouchViewHandler : ViewHandler<IMultiTouchView, PlatformView> 
{
    public readonly static IPropertyMapper<IMultiTouchView, MultiTouchViewHandler> Mapper = 
        new PropertyMapper<IMultiTouchView, MultiTouchViewHandler>(ViewMapper)
        {
            [nameof(MultiTouchView.UnderlyingView)] = MapUnderlyingView
        };

    private PlatformView? _underlyingView = null;

    private IList<ButtonConfig> _buttonConfigs = new List<ButtonConfig>();
    private IList<PressStatus> _buttonState = new List<PressStatus>();

    public MultiTouchViewHandler() : base(Mapper) { }

    private static void MapUnderlyingView(MultiTouchViewHandler handler, IMultiTouchView view)
    {
        handler._underlyingView = view.UnderlyingView?.Handler?.PlatformView as PlatformView;
    }

    protected override PlatformView CreatePlatformView()
    {
        // return new MultiTouch(Context, VirtualView);
        var pView = new PlatformView(Context);
        return pView;
    }

    protected override void ConnectHandler(PlatformView platformView)
    {
        base.ConnectHandler(platformView);
        _buttonConfigs = VirtualView.ButtonConfigs;
        _buttonState = _buttonConfigs
            .Select(_ => (PressStatus)new PressStatus.None())
            .ToList();
        platformView.Touch += OnPlatformTouch;
    }

    protected override void DisconnectHandler(PlatformView platformView)
    {
        base.DisconnectHandler(platformView);
        platformView.Touch -= OnPlatformTouch;
    }

    private bool CheckPointerInButton(double x, double y, ButtonConfig config)
    {
        return x > config.X
            && x < (config.X + config.Width)
            && y > config.Y
            && y < (config.Y + config.Height);
    }

    private void OnPlatformTouch(object? sender, PlatformView.TouchEventArgs e)
    {
        var motionEvent = e.Event;
        if (motionEvent is null)
        {
            return;
        }

        VirtualView.OnMultiTouchEvent($"{motionEvent.ActionMasked.ToString()}");

        switch (motionEvent.ActionMasked)
        {
            case MotionEventActions.Move:
                HandleMotionMove(motionEvent);
                _underlyingView?.DispatchTouchEvent(motionEvent);
            break;
            case MotionEventActions.Down:
            case MotionEventActions.PointerDown:
                HandleMotionDown(motionEvent);
            break;
            case MotionEventActions.Up:
            case MotionEventActions.PointerUp:
                HandleMotionUp(motionEvent);
                _underlyingView?.DispatchTouchEvent(motionEvent);
            break;
        }

        e.Handled = true;
    }

    private void HandleMotionMove(MotionEvent motionEvent)
    {
        foreach(var (index, config) in _buttonConfigs.Index())
        {
            if (config.IsTap) continue;

            var touched = false;
            for (int i = 0; i < motionEvent.PointerCount; ++i)
            {
                MotionEvent.PointerCoords coord = new();
                motionEvent.GetPointerCoords(i, coord);

                var mauiX = Context.FromPixels(coord.X);
                var mauiY = Context.FromPixels(coord.Y);

                bool inButton = CheckPointerInButton(mauiX, mauiY, config);

                if (inButton)
                {
                    touched = true;
                }
            }

            var state = _buttonState[index];

            switch(state)
            {
                case PressStatus.Pressed:
                    if (!touched)
                    {
                        _buttonState[index] = new PressStatus.None();
                        VirtualView.OnUpdateButton(index, false);
                    }
                break;
                case PressStatus.None:
                    if (touched)
                    {
                        _buttonState[index] = new PressStatus.Pressed();
                        VirtualView.OnUpdateButton(index, true);
                    }
                break;
            }
        }
    }

    private void HandleMotionDown(MotionEvent motionEvent)
    {
        var pressIndex = motionEvent.ActionIndex;
        var pressId = motionEvent.GetPointerId(pressIndex);

        MotionEvent.PointerCoords pressCoord = new();
        motionEvent.GetPointerCoords(pressIndex, pressCoord);

        var mauiX = Context.FromPixels(pressCoord.X);
        var mauiY = Context.FromPixels(pressCoord.Y);

        bool handled = false;

        foreach (var (index, config) in _buttonConfigs.Index())
        {
            var state = _buttonState[index];

            bool inButton = CheckPointerInButton(mauiX, mauiY, config);

            if (config.IsTap)
            {
                if (inButton)
                {
                    switch (state)
                    {
                        case PressStatus.None:
                            _buttonState[index] = new PressStatus.PressedTap([pressId]);
                            VirtualView.OnUpdateButton(index, true);
                        break;
                        case PressStatus.PressedTap(var motionId):
                            motionId.Add(pressId);
                        break;
                    }
                    handled = true;
                }
                continue;
            }

            switch(state)
            {
                case PressStatus.None:
                    if (inButton)
                    {
                        handled = true;
                        _buttonState[index] = new PressStatus.Pressed();
                        VirtualView.OnUpdateButton(index, true);
                    }
                break;
            }
        }

        if (!handled)
        {
            _underlyingView?.DispatchTouchEvent(motionEvent);
        }
    }

    private void HandleMotionUp(MotionEvent motionEvent)
    {
        var liftedIndex = motionEvent.ActionIndex;
        var liftedPointerId = motionEvent.GetPointerId(liftedIndex);

        MotionEvent.PointerCoords liftedCoord = new();
        motionEvent.GetPointerCoords(liftedIndex, liftedCoord);

        VirtualView.OnMultiTouchEvent($"PointerID: {liftedPointerId}");

        foreach(var (index, config) in _buttonConfigs.Index())
        {
            if (config.IsTap)
            {
                var state = _buttonState[index];
                switch (state)
                {
                    case PressStatus.PressedTap(var motionId):
                        VirtualView.OnMultiTouchEvent($"ALL THE MOTIONS {string.Join(" ", motionId)}");
                        motionId.RemoveAll(n => n == liftedPointerId);
                        if (motionId.Count == 0)
                        {
                            _buttonState[index] = new PressStatus.None();
                            VirtualView.OnUpdateButton(index, false);
                        }
                    break;
                }

                continue;
            }

            bool stayed = false;
            for (int i = 0; i < motionEvent.PointerCount; ++i)
            {
                if (liftedIndex == i) continue;

                MotionEvent.PointerCoords coord = new();
                motionEvent.GetPointerCoords(i, coord);

                if (liftedCoord == coord) continue;

                double mauiX = Context.FromPixels(coord.X);
                double mauiY = Context.FromPixels(coord.Y);

                bool inButton = CheckPointerInButton(mauiX, mauiY, config);

                if (inButton)
                {
                    stayed = true;
                    break;
                }
            }

            if (!stayed)
            {
                _buttonState[index] = new PressStatus.None();
                VirtualView.OnUpdateButton(index, false);
            }
        }
    }
}