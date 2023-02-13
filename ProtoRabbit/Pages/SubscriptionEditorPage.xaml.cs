using ProtoRabbit.ViewModels;

namespace ProtoRabbit.Pages;

public partial class SubscriptionEditorPage : ContentPage
{
	public SubscriptionEditorPage(SubscriptionEditorViewModel subscriptionEditorViewModel)
	{
		InitializeComponent();

		BindingContext = subscriptionEditorViewModel;
	}
}
