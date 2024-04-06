using HealthSharer.Models;

namespace HealthSharer.Abstractions
{
    public interface IAssistantService
    {
        Task<AssistantResponse> Prompt(int ownerId, string userMessage);
        Task<List<AssistantResponse>> Prompt(List<DetectionRequest> requests, int ownerId);
        List<AssistantResponse> GetMessageHistory(int ownerId);
        Task<string> Prompt(string hl7FilesSummaryStr);
    }
}
