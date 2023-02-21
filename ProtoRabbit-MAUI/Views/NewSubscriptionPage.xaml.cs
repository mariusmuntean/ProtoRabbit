using Microsoft.Maui.Controls;
using ProtoRabbit.ViewModels;

namespace ProtoRabbit.Views;

public partial class NewSubscriptionPage : ContentPage
{
    public NewSubscriptionPage(NewSubscriptionViewModel newSubscriptionViewModel)
    {
        InitializeComponent();

        BindingContext = newSubscriptionViewModel;
    }
}