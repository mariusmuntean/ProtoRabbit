namespace ProtoRabbit.Views.Components;

public partial class SectionControl : ContentView
{
    public SectionControl()
    {
        InitializeComponent();
    }

    public static readonly BindableProperty SectionTitleProperty = BindableProperty.Create(
        nameof(SectionTitle),
        typeof(string),
        typeof(SectionControl)
            );

    public string SectionTitle
    {
        get => (string)GetValue(SectionTitleProperty);
        set => SetValue(SectionTitleProperty, value);
    }
}
