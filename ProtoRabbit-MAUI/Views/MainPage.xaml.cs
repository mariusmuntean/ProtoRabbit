using Microsoft.Maui.Controls;
using ProtoRabbit.ViewModels;

namespace ProtoRabbit.Views;

public partial class MainPage : ContentPage
{
    public MainPage(MainPageViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}