using HealthSharer.Models;
using Microsoft.VisualBasic;
using System.Collections.Generic;

namespace HealthSharer.Abstractions
{
    public interface IInformationService
    {
        GetInformationResponse AddInformation(AddInformationRequest addInformationRequest);
        void AddAllInformation(List<AddInformationRequest> informationList);
        List<GetAllInformationResponse> GetAllInformationByAccessor(int userId);
        List<GetInformationResponse> GetAllInformationByOwner(int userId);

    }
}
