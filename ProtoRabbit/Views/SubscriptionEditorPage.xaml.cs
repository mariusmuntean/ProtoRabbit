using Microsoft.Maui.Controls;
using ProtoRabbit.ViewModels;

namespace ProtoRabbit.Views;

public partial class SubscriptionEditorPage : ContentPage
{
	public SubscriptionEditorPage(SubscriptionEditorViewModel subscriptionEditorViewModel)
	{
		InitializeComponent();

		BindingContext = subscriptionEditorViewModel;
	}
}
