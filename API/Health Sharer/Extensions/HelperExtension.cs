using HealthSharer.Models;
using System.Text.Json;
using WebData.Models;

namespace HealthSharer.Extensions
{
    public static class HelperExtension
    {
        public static string ToHashedString(this string message)
        {
            return "";
        }

        public static string FromHashedString(this string messageHash) 
        {
            return "";
        }

        public static Page<T> ToPaged<T>(this List<T> list, int page, int pageSize)
        {
            return new Page<T>()
            {
                PageNumber = page,
                PageSize = pageSize,
                TotalItems = list.Count,
                Items = list
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList()
            };
        }

        public static string Serialize(this List<AddJSONFileFromTextContent> content)
        {
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonString = JsonSerializer.Serialize(content, options);
            return jsonString;
        }

        public static List<AddJSONFileFromTextContent> Deserialize(this string content)
        {
            return JsonSerializer.Deserialize<List<AddJSONFileFromTextContent>>(content);
        }

    }
}
