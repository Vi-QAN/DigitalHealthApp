using WebData.Models;

namespace WebData.Abstractions
{
    public interface IInformationRepository : IBaseRepository
    {
        void AddInformation(Information information);
        void AddAllInformation(IEnumerable<Information> information);
        void deleteInformation(Information information);
        IQueryable<Information> getAllInformationByUser(int userId);
        IQueryable<Information> getAllInformation();
        Information GetInformation(int userId, string fileHash);
    }
}
