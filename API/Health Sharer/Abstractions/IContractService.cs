using HealthSharer.Models;

namespace HealthSharer.Abstractions
{
    public interface IContractService
    {
        Task SetKey(string address, RandomSeed random);
        Task<RandomSeed> GetKey(string address, string accessor);  
    }
}
