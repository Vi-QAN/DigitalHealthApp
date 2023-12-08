using DigitalHealthService.Models;

namespace DigitalHealthService.Abstractions
{
    public interface IInformationService
    {
        GetInformationResponse AddInformation(AddInformationRequest addInformationRequest);
        List<GetAllInformationResponse> GetAllInformationByAccessor(int userId);
        List<GetInformationResponse> GetAllInformationByOwner(int userId);

    }
}
