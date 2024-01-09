namespace WebData.Abstractions
{
    public interface IBaseRepository
    {
        void SaveChanges();
        Task SaveChangesAsync();
    }
}
