using Microsoft.Maui.Controls;

namespace ProtoRabbit;

public partial class App : Application
{
    public App()
    {
        InitializeComponent();

        MainPage = new AppShell();

#if MACCATALYST
        // This is necessary on macOS because straight quotes are repaed by "”" or by "“".
        Microsoft.Maui.Handlers.EditorHandler.Mapper.AppendToMapping("custom", (handler, view) =>
        {
            handler.PlatformView.SmartQuotesType = UIKit.UITextSmartQuotesType.No;
        });
#endif
    }
}