using HealthSharer.Models;
using System.Collections.Generic;

namespace HealthSharer.Abstractions
{
    public interface IInformationService
    {
        GetInformationResponse AddInformation(AddInformationRequest addInformationRequest);
        List<GetAllInformationResponse> GetAllInformationByAccessor(int userId);
        List<GetInformationResponse> GetAllInformationByOwner(int userId);

    }
}
