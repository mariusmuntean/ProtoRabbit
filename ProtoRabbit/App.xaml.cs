using Microsoft.Maui;
using Microsoft.Maui.Controls;
using Microsoft.Maui.Handlers;
using UIKit;

namespace ProtoRabbit;

public partial class App : Application
{
    public App()
    {
        InitializeComponent();

        MainPage = new AppShell();

#if MACCATALYST
        // This is necessary on macOS because straight quotes are repaed by "”" or by "“".
        EditorHandler.Mapper.AppendToMapping("custom", (handler, view) =>
        {
            handler.PlatformView.SmartQuotesType = UITextSmartQuotesType.No;
        });
#endif
    }
}