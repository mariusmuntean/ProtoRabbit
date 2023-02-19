using Microsoft.Maui;
using Microsoft.Maui.Controls;
using Microsoft.Maui.Handlers;

#if MACCATALYST
using UIKit;
#endif

namespace ProtoRabbit;

public partial class App : Application
{
    public App()
    {
        InitializeComponent();

        MainPage = new AppShell();

#if MACCATALYST
        // This is necessary on macOS because straight quotes are replaced by "”" or by "“".
        EditorHandler.Mapper.AppendToMapping("custom", (handler, view) =>
        {
            handler.PlatformView.SmartQuotesType = UITextSmartQuotesType.No;
        });
#endif
    }
}