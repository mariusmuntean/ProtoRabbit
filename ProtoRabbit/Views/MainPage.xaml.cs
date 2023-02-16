using Microsoft.Maui.Controls;
using ProtoRabbit.ViewModels;

namespace ProtoRabbit.Views;

public partial class MainPage : ContentPage
{
    int count = 0;

    public MainPage(MainPageViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}