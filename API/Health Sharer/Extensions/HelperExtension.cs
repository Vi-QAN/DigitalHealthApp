using HealthSharer.Models;
using System.Text.Json;
using WebData.Models;
using File = HealthSharer.Models.File;

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

        public static List<AddJSONFileFromTextContent> DeserializeWeareableDataFile(this string content)
        {
            var result = new List<AddJSONFileFromTextContent>();
            try
            {
                result = JsonSerializer.Deserialize<List<AddJSONFileFromTextContent>>(content);
            } catch (Exception ex){
                Console.WriteLine(ex.Message);
            }

            return result;
        }

        public static List<WearableDataFileSummary> Summarize(this List<List<AddJSONFileFromTextContent>> list, List<File> fileInfoList)
        {
            List<WearableDataFileSummary> result = new List<WearableDataFileSummary>();

            if (list.Count == 0 || fileInfoList.Count == 0) return result;

            var numOfRecords = list.Count;

            for (int i = 0; i < list.Count; i++)
            {
                var jsonContent = list.ElementAt(i).OrderBy(i => DateTime.Parse(i.DateTime)).ToList();
                var noOfRecords = jsonContent.Count;
                
                var fileInfo = fileInfoList.ElementAt(i);

                var summary = new WearableDataFileSummary()
                {
                    Id = fileInfo.Id,
                    Name = fileInfo.Name,
                    NumberOfRecords = noOfRecords,
                    BloodPressureAverage = jsonContent.Sum(i => i.BloodPressure) / noOfRecords,
                    OxygenLevelAverage = jsonContent.Sum(i => i.OxygenLevel) / noOfRecords,
                    HeartRateAverage = jsonContent.Sum(i => i.HeartRate) / noOfRecords,
                    FromDate = DateTime.Parse(jsonContent.First().DateTime),
                    ToDate = DateTime.Parse(jsonContent.Last().DateTime)
                };

                result.Add(summary);
            }

            return result;
        }

        public static string Summarize(this List<GetHL7FileResponse> list)
        {
            string result = "";

            if (list.Count == 0) return result;

            List<string> names = new List<string>();
            List<string> dobs = new List<string>();
            List<char> sexes = new List<char>();
            List<string> diagnoses =  new List<string>();
            List<string> allergies = new List<string>();

            foreach (var res in list)
            {
                if (res.AdmissionContent != null)
                {
                    if (res.AdmissionContent.PatientName != null)
                    {
                        names.Add(res.AdmissionContent.PatientName);
                    }

                    if (res.AdmissionContent.DOB != null)
                    {
                        dobs.Add(res.AdmissionContent.DOB);
                    }

                    if (res.AdmissionContent.Sex != null)
                    {
                        var sex = res.AdmissionContent.Sex[0];
                        sexes.Add(sex);
                    }

                    if (res.AdmissionContent.Allergies.Count > 0)
                    {
                        allergies.AddRange(res.AdmissionContent.Allergies);
                    }

                    if (res.AdmissionContent.Diagnosises.Count > 0)
                    {
                        diagnoses.AddRange(res.AdmissionContent.Diagnosises);
                    }
                }

                if (res.OrderEntryContent != null)
                {
                    if (res.OrderEntryContent.PatientName != null)
                    {
                        names.Add(res.OrderEntryContent.PatientName);
                    }

                    if (res.OrderEntryContent.DOB != null)
                    {
                        dobs.Add(res.OrderEntryContent.DOB.Split("/")[0]);
                    }

                    if (res.OrderEntryContent.Sex != null)
                    {
                        var sex = res.OrderEntryContent.Sex[0];
                        sexes.Add(sex);
                    }

                    if (res.OrderEntryContent.Allergies.Count > 0)
                    {
                        allergies.AddRange(res.OrderEntryContent.Allergies);
                    }

                    if (res.OrderEntryContent.Diagnosises.Count > 0)
                    {
                        diagnoses.AddRange(res.OrderEntryContent.Diagnosises);
                    }
                }
            }

            if (names.Count > 0)
            {
                result += "Name on record" + names[0];
            }

            if (dobs.Count > 0)
            {
                result += " Age " + (DateTime.UtcNow.Year - int.Parse(dobs[0].Split("/")[0]));
            }

            if (sexes.Count > 0)
            {
                result += " Sex ";
                result += (sexes[0] == 'M') ? "Male" : "Female";
            }
            
            if (allergies.Count > 0)
            {
                result += " Allergies " + string.Join(", ", allergies);
            }

            if (diagnoses.Count > 0)
            {
                result += " Diagnoses " + string.Join(", ", diagnoses);
            }

            return result;
        }

        public static string Serialize(this List<WearableDataFileSummary> summary)
        {
            return JsonSerializer.Serialize(summary);
        }

        public static List<WearableDataFileSummary> DeserializeWearableDataSummary(this string summaryStr) 
        {
            return JsonSerializer.Deserialize<List<WearableDataFileSummary>>(summaryStr);
        }

        public static string Serialize(this MedicalDataSummary summary)
        {
            return JsonSerializer.Serialize(summary);
        }

        public static MedicalDataSummary DeserializeMedicalDataSummary(this string summaryStr)
        {
            return JsonSerializer.Deserialize<MedicalDataSummary>(summaryStr);
        }

        public static string Serialize(this List<File> list)
        {
            return JsonSerializer.Serialize(list);
        }

        public static List<File> DeserializeSummaryFileList(this string list)
        {
            return JsonSerializer.Deserialize<List<File>>(list);
        }

    }
}
