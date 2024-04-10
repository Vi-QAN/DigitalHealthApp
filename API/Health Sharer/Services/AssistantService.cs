using LangChain.Memory;
using LangChain.Providers;
using LangChain.Providers.OpenAI;
using System.Runtime.Serialization;
using LangChain.Providers.OpenAI.Predefined;
using static LangChain.Chains.Chain;
using System;
using HealthSharer.Models;
using WebData.Abstractions;
using HealthSharer.Abstractions;
using WebData.Models;
namespace HealthSharer.Services
{
    public class AssistantService : IAssistantService
    {
        private readonly IAssistantRepository _assistantRepository;
        private readonly IUserService _userService;
        
        private static string OPENAI_API_KEY = Environment.GetEnvironmentVariable("OPENAI_API_KEY");

        private static Gpt35TurboModel model = new Gpt35TurboModel(OPENAI_API_KEY);
        private static BaseChatMessageHistory chatHistory = new ChatMessageHistory();

        public AssistantService(IAssistantRepository assistantRepository, IUserService userService)
        {
            _assistantRepository = assistantRepository;
            _userService = userService;
        }
        
        private static BaseChatMemory GetConversationBufferMemory(BaseChatMessageHistory chatHistory, MessageFormatter messageFormatter)
        {
            return new ConversationBufferMemory(chatHistory)
            {
               
                Formatter = messageFormatter
            };
        }

        private static MessageFormatter GetMessageFormatter(string username)
        {
            return new MessageFormatter()
            {
                AiPrefix = "Assistant",
                HumanPrefix = username,
            };
        }
       
        private static async Task<string> Prompt(string username, string userMessage)
        {
            var messageFormatter = GetMessageFormatter(username);
            var conversationBufferMemmory = GetConversationBufferMemory(chatHistory, messageFormatter);
            var template = @"
                The following is a friendly conversation between a human and an AI.

                {history}
                Human: {input}
                AI: ";
            
            var chain =
                LoadMemory(conversationBufferMemmory, outputKey: "history")
                | Template(template)
                | LLM(model)
                | UpdateMemory(conversationBufferMemmory, requestKey: "input", responseKey: "text");

            var currentChain = Set(userMessage, "input") | chain;
            // Get a response from the AI
            var response = await currentChain.Run("text");

            return response;
        }

        public async Task<AssistantResponse> Prompt(int ownerId, string userMessage) {
            var user = _userService.GetUser(ownerId);

            try
            {
                var response = await Prompt(user.Name, userMessage);

                var newAssistantMessages = new List<AssistantMessage>()
                {
                    new AssistantMessage()
                    {
                        From = user.Name,
                        Content = userMessage,
                        CreatedDate = DateTime.UtcNow,
                        OwnerId = ownerId,
                    },

                    new AssistantMessage()
                    {
                        From = "Assistant",
                        Content = response,
                        CreatedDate = DateTime.UtcNow,
                        OwnerId = ownerId,
                    }
                };

                _assistantRepository.AddMessages(newAssistantMessages);
                _assistantRepository.SaveChanges();

                return new AssistantResponse()
                {
                    MessageId = newAssistantMessages[1].Id,
                    From = newAssistantMessages[1].From,
                    CreatedDate = newAssistantMessages[1].CreatedDate,
                    MessageContent = newAssistantMessages[1].Content
                };

            } catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<AssistantResponse>> Prompt(List<DetectionRequest> requests, int ownerId)
        {
            var user = _userService.GetUser(ownerId);
            var list = _assistantRepository.GetMessages(user.UserId).ToList();
            var newAssistantMessages = new List<AssistantMessage>();

            foreach(var request in requests)
            {
                var status = request.IsGreaterThanNormal ? "greater than normal" : "lower than normal";
                var unit = "";

                switch (request.Field)
                {
                    case "blood pressure":
                        unit = "mmHg";
                        break;
                    case "oxygen level":
                        unit = "%SpO2";
                        break;
                    case "heart rate":
                        unit = "bpm";
                        break;
                    default:
                        unit = "Unit not available";
                        break;
                }

                var systemMessage = $"Detected: {request.Field} is {status} with value {request.Value} {unit}";
                newAssistantMessages.Add(new AssistantMessage()
                {
                    From = "Assistant",
                    Content = systemMessage,
                    CreatedDate = DateTime.UtcNow,
                    OwnerId = ownerId,
                });
            }
            
            if (list.Count == 0)
            {
                try
                {
                    var promptMessage = $"What are the recommendations when heart rate, blood pressure or oxygen level is abnormal Give me top 5 recommendations";
                    var response = await Prompt(user.Name, promptMessage);
                    response += $"\nIs there anything specific you'd like to know more about regarding improving these, or any concerns you have?";
                    var AIMessage = new AssistantMessage()
                    {
                        From = "Assistant",
                        Content = response,
                        CreatedDate = DateTime.UtcNow,
                        OwnerId = ownerId,
                    };
                }
                catch (Exception ex)
                {
                    return null;
                }
            }

            _assistantRepository.AddMessages(newAssistantMessages);
            _assistantRepository.SaveChanges();

            return newAssistantMessages.Select(m => new AssistantResponse()
            {
                MessageId = m.Id,
                From = m.From,
                CreatedDate = m.CreatedDate,
                MessageContent = m.Content
            }).OrderByDescending(m => m.CreatedDate).ToList();
        }

        public List<AssistantResponse> GetMessageHistory(int ownerId)
        {
            var user = _userService.GetUser(ownerId);
            var list = _assistantRepository.GetMessages(user.UserId);
            return list.Select(m => new AssistantResponse()
            {
                MessageId = m.Id,
                From = m.From,
                CreatedDate = m.CreatedDate,
                MessageContent = m.Content
            }).OrderByDescending(m => m.CreatedDate).Take(10).ToList();
        }

        public async Task<string> Prompt(string hl7FilesSummaryStr)
        {
            return await model.GenerateAsync("Generate a summary paragraph for the following medical information " + hl7FilesSummaryStr);
        }
    }
}
