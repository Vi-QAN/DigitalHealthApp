using Gehtsoft.PDFFlow.Builder;
using Gehtsoft.PDFFlow.Models.Enumerations;
using Gehtsoft.PDFFlow.Models.Shared;
using Gehtsoft.PDFFlow.Utils;
using HealthSharer.Models;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using WebData.Models;
using Color = Gehtsoft.PDFFlow.Models.Shared.Color;

namespace HealthSharer.Extensions
{
    public static class PDFBuilderExtensions
    {
        public static StyleBuilder StyledDocument = StyleBuilder.New()
            .SetFont(Fonts.Times(12))
            .SetFontColor(Color.Black)
            .SetLineSpacing(1.5f);

        public static StyleBuilder StyledParagraph = StyleBuilder.New()
            .SetLineSpacing(1.5f);

        public static StyleBuilder StyledHeader = StyleBuilder.New(StyledDocument)
            .SetFontBold();

        public static StyleBuilder StyledFieldName = StyleBuilder.New(StyledDocument);

        public static void PrepareDocument(this DocumentBuilder documentBuilder)
        {
            documentBuilder
                .SetParagraphStyle(StyledParagraph);
        }

        public static void AddTitle(this SectionBuilder sectionBuilder){
            sectionBuilder.AddParagraph("Medical Request Form")
                .SetAlignment(HorizontalAlignment.Center)
                .SetFont(Fonts.Times(18))
                .SetFontColor(Color.Black)
                .ToSection();
        }
            
        public static void AddProviderSection(this SectionBuilder sectionBuilder, AddPDFFileFromTextContent.ProviderInformation provider )
        {
            sectionBuilder.AddParagraph("Provider Information")
                    .ApplyStyle(StyledHeader)
                    .ToSection()
                .AddParagraph($"Name: {provider.Name}").ApplyStyle(StyledFieldName).ToSection()
                .AddParagraph($"Address: {provider.Address}").ApplyStyle(StyledFieldName).ToSection();
        }

        public static async void AddPatientSection(this SectionBuilder sectionBuilder, AddPDFFileFromTextContent.PatientInformation patient)
        {
            using (var imageStream = patient.IDImage.OpenReadStream())
            using (var image = Image.FromStream(imageStream))
            using (MemoryStream memoryStream = new MemoryStream())
            {
                image.Save(memoryStream, ImageFormat.Png);
                var contentBytes = memoryStream.ToArray();
                sectionBuilder.AddParagraph("Patient Information")
                .ApplyStyle(StyledHeader)
                .ToSection()
                    .AddParagraph($"Name: {patient.Name}").ApplyStyle(StyledFieldName).ToSection()
                    .AddParagraph($"Address: {patient.Address}").ApplyStyle(StyledFieldName).ToSection()
                    .AddParagraph($"Phone: {patient.Phone}").ApplyStyle(StyledFieldName).ToSection()
                    .AddParagraph("Identification Document: ").ApplyStyle(StyledFieldName).ToSection()
                    .AddImage(contentBytes, new XSize(200, 100), ScalingMode.UserDefined).ApplyStyle(StyledFieldName).ToSection();
            }            
                
        }

        public static void AddRequestedDocuments(this SectionBuilder sectionBuilder, List<string> requestedDocuments)
        {
            sectionBuilder.AddParagraph("Requested Documents")
                    .ApplyStyle(StyledHeader)
                    .ToSection();

            foreach (var doc in requestedDocuments)
            {
                sectionBuilder.AddParagraph(doc).ApplyStyle(StyledFieldName).SetListBulleted().ToSection();
            }            
        }
    }
}
