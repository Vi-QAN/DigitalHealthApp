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

        public UserService(IUserRepository userRepository, IContractService contractService)
        {
            _userRepository = userRepository;
            _contractService = contractService;
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
                UserId = user.Id,
                Key = user.PublicKey,
                Name = user.Name,
            };
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
                UserId = user.Id,
                Key = user.PublicKey,
                Name = user.Name,
            };
        }

        /*public int UpdateUser(AddUserRequest request)
        {
            var user = _userRepository.GetUserByContract(request.PublicKey);

            if (user == default)
            {
                throw new NotFoundException("User not found");
            }

            user.PublicKey = request.PublicKey;
            
            _userRepository.UpdateUser(user);

            return user.UserId;
        }*/



        public GetUserResponse Signup(SignupRequest request)
        {
            var user = _userRepository.GetUserByAddress(request.Key);
            if (user != default)
            {
                return new GetUserResponse()
                {
                    UserId = user.Id,
                    Key = request.Key,
                };
            }

            var random = CryptographicService.GenerateRandom();
            _contractService.SetKey(request.Key, random).Wait();

            var newUser = new User()
            {
                Name = request.UserName,
                PublicKey = request.Key,
            };
            _userRepository.AddUser(newUser);

            _userRepository.SaveChanges();

            return new GetUserResponse()
            {
                UserId = newUser.Id,
                Key = request.Key,
            };
        }

        public List<GetUserResponse> GetUsers()
        {
            var users = _userRepository.GetAllUsers()
                .Select(u => new GetUserResponse()
                {
                    UserId = u.Id,
                    Key = u.PublicKey,
                    Name = u.Name,
                }).ToList();

            return users;
        }

    }
}
