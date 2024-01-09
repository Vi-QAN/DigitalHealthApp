using WebData.Abstractions;
using WebData.Models;

namespace WebData.Repositories
{
    public class InformationRepository : IInformationRepository
    {
        private readonly DigitalHealthContext _context;

        public InformationRepository(DigitalHealthContext context)
        {
            _context = context;
        }

        public void AddAllInformation(IEnumerable<Information> information)
        {
            _context.Information.AddRange(information);
        }

        public void AddInformation(Information information)
        {
            _context.Information.Add(information);
        }

        public void deleteInformation(Information information)
        {
            _context.Information.Remove(information);
        }

        public IQueryable<Information> getAllInformation()
        {
            return _context.Information;
        }

        public IQueryable<Information> getAllInformationByUser(int userId)
        {
            return _context.Information.Where(i => i.UserId == userId);
        }

        public Information GetInformation(int userId, string fileHash)
        {
            return _context.Information.FirstOrDefault(i => i.UserId == userId && i.FileHash == fileHash);
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        
    }
}
