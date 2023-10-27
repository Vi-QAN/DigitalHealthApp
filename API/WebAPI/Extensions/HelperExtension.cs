using WebAPI.Models;
using WebData.Models;

namespace WebAPI.Extensions
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
    }
}
