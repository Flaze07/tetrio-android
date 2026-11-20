namespace TetrioMaui.Models;

public record ButtonConfig
{
    public float X
    {
        get;
        set
        {
            field = Math.Max(0, value);
        }
    }

    public float Y
    {
        get;
        set
        {
            field = Math.Max(0, value);
        }
    }

    public float Width
    {
        get;
        set
        {
            field = Math.Max(0, value);
        }
    }

    public float Height
    {
        get;
        set
        {
            field = Math.Max(0, value);
        }
    }

    public bool IsTap
    {
        get;
        set;
    } = true;

    public Color Color
    {
        get;
        set;
    } = Colors.SlateGray;

    public Rect Bounds => new(X, Y, Width, Height);
}