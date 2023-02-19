using System.Globalization;
using System.Text.Json;

namespace ProtoRabbit.Views.ValueConverters;

public class WrappedMessageToJsonConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        return JsonSerializer.Serialize(value);
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}