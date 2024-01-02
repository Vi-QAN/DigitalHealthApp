using HealthSharer.Abstractions;
using HealthSharer.Exceptions;
using HealthSharer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System.Collections.Generic;
using System.Linq;
using WebData.Abstractions;
using WebData.Models;

namespace HealthSharer.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IContractService _contractService;
       
        public UserService(IUserRepository userRepository, IContractService contractService) {
            _userRepository = userRepository;
            _contractService = contractService;
        }

        public GetUserResponse GetUser(string address)
        {
            var user = _userRepository.GetUserByAddress(address);

            if (user == default)
            {
                throw new NotFoundException("User not found");
            }

            return new GetUserResponse()
            {
                UserId = user.UserId,
                Key = user.ContractAddress,
            };
        }

        /*public int UpdateUser(AddUserRequest request)
        {
            var user = _userRepository.GetUserByContract(request.ContractAddress);

            if (user == default)
            {
                throw new NotFoundException("User not found");
            }

            user.ContractAddress = request.ContractAddress;
            
            _userRepository.UpdateUser(user);

            return user.UserId;
        }*/

        public int AddAuthorization(AuthorizationRequest request)
        {
            var owner = _userRepository.GetUserByAddress(request.OwnerId);
            var accessor = _userRepository.GetUserByAddress(request.AccesserId);
            
            if (owner == default)                
                throw new NotFoundException("Owner Not Found");

            if (accessor == default)
                throw new NotFoundException("Accesser Not Found");

            var record = _userRepository.GetAllAuthorizationRecords()
                .FirstOrDefault(r => r.AccessorId == accessor.UserId 
                                    && r.OwnerId == owner.UserId);

            if (record == default)
            {
                var newRecord = new AuthorizationRecord()
                {
                    OwnerId = owner.UserId,
                    AccessorId = accessor.UserId,
                    IsAuthorized = true
                };

                _userRepository.AddAuthorizationRecord(newRecord);
                _userRepository.SaveChanges();
                
                return newRecord.AccessorId;
            }
            
            record.IsAuthorized = true;
            _userRepository.UpdateAuthorizationRecord(record);
            _userRepository.SaveChanges();

            return accessor.UserId;
        }

        public int RemoveAuthorization(AuthorizationRequest request)
        {
            var owner = _userRepository.GetUserByAddress(request.OwnerId);
            var accessor = _userRepository.GetUserByAddress(request.AccesserId);

            if (owner == default)
                throw new NotFoundException("Owner Not Found");

            if (accessor == default)
                throw new NotFoundException("Accesser Not Found");

            var record = _userRepository.GetAllAuthorizationRecords()
                .FirstOrDefault(r => r.AccessorId == accessor.UserId
                                    && r.OwnerId == owner.UserId);

            if (record == default)
                throw new NotFoundException("User has never been authorized");

            record.IsAuthorized = false;
            _userRepository.UpdateAuthorizationRecord(record);
            _userRepository.SaveChanges();

            return accessor.UserId;
        }

        public List<GetAuthorizationResponse> GetAuthorization(int userId)
        {
            var user = _userRepository.GetUserById(userId);
            var users = _userRepository.GetAllUsers();

            if (user == default)
                throw new NotFoundException("User not found");

            return _userRepository
                .GetAllAuthorizationRecords()
                .Where(r => r.OwnerId == userId)
                .Join(
                    users,
                    record => record.AccessorId,
                    user => user.UserId,
                    (record, user) => new GetAuthorizationResponse()
                    {
                        AccessorId = record.AccessorId,
                        Name = user.Name,
                        IsAuthorized = record.IsAuthorized,
                    }
                ).ToList();
        }

        public GetUserResponse Signup(SignupRequest request)
        {
            var user = _userRepository.GetUserByContract(request.Key);
            if (user != default)
            {
                return new GetUserResponse()
                {
                    UserId = user.UserId,
                    Key = request.Key,
                };
            }

            var random = CryptographicService.GenerateRandom();
            _contractService.SetKey(request.Key, random).Wait();

            var newUser = new User()
            {
                Name = request.UserName,
                ContractAddress = request.Key,
            };
            _userRepository.AddUser(newUser);

            _userRepository.SaveChanges();

            return new GetUserResponse()
            {
                UserId = newUser.UserId,
                Key = request.Key,
            };
        }
    }
}
