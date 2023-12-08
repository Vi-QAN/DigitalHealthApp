using DigitalHealthService.Abstractions;
using DigitalHealthService.Exceptions;
using DigitalHealthService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using WebData.Abstractions;
using WebData.Models;

namespace DigitalHealthService.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository) {
            _userRepository = userRepository;
        }

        public int AddUser(AddUserRequest request)
        {
            var user = _userRepository.GetUserByContract(request.ContractAddress);
            if (user != default)
            {
                return user.UserId;
            }
            
            var newUser = new User()
            {
                Name = request.UserName,
                ContractAddress = request.ContractAddress,
            };
            _userRepository.AddUser(newUser);
            
            _userRepository.SaveChanges();

            return newUser.UserId;

        }

        public GetUserResponse GetUser(int id)
        {
            var user = _userRepository.GetUserById(id);

            if (user == default)
            {
                throw new NotFoundException("User not found");
            }

            return new GetUserResponse()
            {
                UserId = user.UserId,
                ContractAddress = user.ContractAddress,
            };
        }

        public int UpdateUser(AddUserRequest request)
        {
            var user = _userRepository.GetUserByContract(request.ContractAddress);

            if (user == default)
            {
                throw new NotFoundException("User not found");
            }

            user.ContractAddress = request.ContractAddress;
            
            _userRepository.UpdateUser(user);

            return user.UserId;
        }

        public int AddAuthorization(AuthorizationRequest request)
        {
            var owner = _userRepository.GetUserById(request.OwnerId);
            var accesser = _userRepository.GetUserById(request.AccesserId);
            
            if (owner == default)                
                throw new NotFoundException("Owner Not Found");

            if (accesser == default)
                throw new NotFoundException("Accesser Not Found");

            var record = _userRepository.GetAllAuthorizationRecords()
                .FirstOrDefault(r => r.AccessorId == request.AccesserId 
                                    && r.OwnerId == request.OwnerId);

            if (record == default)
            {
                var newRecord = new AuthorizationRecord()
                {
                    OwnerId = request.OwnerId,
                    AccessorId = request.AccesserId,
                    IsAuthorized = true
                };

                _userRepository.AddAuthorizationRecord(newRecord);
                _userRepository.SaveChanges();
                
                return newRecord.AccessorId;
            }
            
            record.IsAuthorized = true;
            _userRepository.UpdateAuthorizationRecord(record);
            _userRepository.SaveChanges();

            return request.AccesserId;
        }

        public int RemoveAuthorization(AuthorizationRequest request)
        {
            var owner = _userRepository.GetUserById(request.OwnerId);
            var accesser = _userRepository.GetUserById(request.AccesserId);

            if (owner == default)
                throw new NotFoundException("Owner Not Found");

            if (accesser == default)
                throw new NotFoundException("Accesser Not Found");

            var record = _userRepository.GetAllAuthorizationRecords()
                .FirstOrDefault(r => r.AccessorId == request.AccesserId
                                    && r.OwnerId == request.OwnerId);

            if (record == default)
                throw new NotFoundException("User has never been authorized");

            record.IsAuthorized = false;
            _userRepository.UpdateAuthorizationRecord(record);
            _userRepository.SaveChanges();

            return request.AccesserId;
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
    }
}
