using HealthSharer.Abstractions;
using HealthSharer.Exceptions;
using HealthSharer.Models;
using WebData.Models;
using WebData.Abstractions;
using WebData.Repositories;
using System.Collections.Generic;

namespace HealthSharer.Services
{
    public class InformationService : IInformationService
    {
        private readonly IUserRepository _userRepository;
        private readonly IInformationRepository _informationRepository;
        private readonly IContractService _contractService;
        public InformationService(IUserRepository userRepository, IInformationRepository informationRepository, IContractService contractService)
        {
            _userRepository = userRepository;
            _informationRepository = informationRepository;
            _contractService = contractService;
        }

        public GetInformationResponse AddInformation(AddInformationRequest addInformationRequest)
        {
            var user = _userRepository.GetUserById(addInformationRequest.OwnerId);
            if (user == default) {
                throw new NotFoundException("User not found");
            }

            var information = _informationRepository.GetInformation(addInformationRequest.OwnerId, addInformationRequest.FileHash);

            if (information != default) {
                throw new BadRequestException("Information existed");
            }

            var newInformation = new Information()
            {
                UserId = addInformationRequest.OwnerId,
                FileHash = addInformationRequest.FileHash,  
                MultiAddress = addInformationRequest.MultiAddress,
                FileName = addInformationRequest.FileName.Split('.')[0],
                FileExtension = addInformationRequest.FileName.Split('.')[1],
                FileType = addInformationRequest.FileType
            };

            _informationRepository.AddInformation(newInformation);
            _informationRepository.SaveChanges();

            return new GetInformationResponse()
            {
                FileName = newInformation.FileName,
                FileExtension = newInformation.FileExtension,
                FileHash = newInformation.FileHash,
                MultiAddress = newInformation.MultiAddress,
            };
            
        }

        public List<GetInformationResponse> GetAllInformationByOwner(int userId)
        {
            var user = _userRepository.GetUserById(userId);
            if (user == default)
            {
                throw new NotFoundException("User not found");
            }

            var information = _informationRepository.getAllInformation();
            return information
                    .Where(i => i.UserId == userId)
                    .Select(i => new GetInformationResponse()
                    {
                        FileExtension = i.FileExtension,
                        FileName = i.FileName,
                        FileHash = i.FileHash,
                        FileType = i.FileType,
                    }).ToList();
        }

        public List<GetAllInformationResponse> GetAllInformationByAccessor(int userId)
        {
            
            var user = _userRepository.GetUserById(userId);
            if (user == default)
            {
                throw new NotFoundException("User not found");
            }

            var information = _informationRepository.getAllInformation();
            var records = _userRepository.GetAuthorizationRecordsByAccessor(userId);
            var users = _userRepository.GetAllUsers();
            var authorizedRecords = records.GroupJoin(
                information,
                record => record.OwnerId,
                info => info.UserId,
                (record, info) => new GetAllInformationResponse()
                {
                    OwnerId = record.OwnerId,
                    IsAuthorized = record.IsAuthorized,
                    InformationList = info.Select(i => new GetInformationResponse()
                    {
                        MultiAddress = i.MultiAddress,
                        FileName = i.FileName,
                        FileHash = i.FileHash,
                        FileExtension = i.FileExtension,
                        FileType = i.FileType,
                    }).ToList(),
                });//.Where(result => result.IsAuthorized);

            return authorizedRecords.Join(
                    users,
                    record => record.OwnerId,
                    user => user.UserId,
                    (record, user) => new GetAllInformationResponse()
                    {
                        OwnerId = record.OwnerId,
                        Key = user.ContractAddress,
                        UserName = user.Name,
                        IsAuthorized = record.IsAuthorized,
                        InformationList = record.InformationList
                    }).ToList();

        }

        public void AddAllInformation(List<AddInformationRequest> requests)
        {
            var user = _userRepository.GetUserById(requests[0].OwnerId);
            if (user == default)
            {
                throw new NotFoundException("User not found");
            }

            var list = requests.Select(request => new Information()
            {
                UserId = request.OwnerId,
                FileHash = request.FileHash,
                MultiAddress = request.MultiAddress,
                FileName = request.FileName.Split('.')[0],
                FileExtension = request.FileName.Split('.')[1],
                FileType = request.FileType
            });

            _informationRepository.AddAllInformation(list);
            _informationRepository.SaveChanges();
        }
    }
}
