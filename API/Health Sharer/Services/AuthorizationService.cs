using AutoMapper.Internal;
using HealthSharer.Abstractions;
using HealthSharer.Exceptions;
using HealthSharer.Models;
using WebData.Abstractions;
using WebData.Models;

namespace HealthSharer.Services
{
    public class AuthorizationService : IAuthorizationService
    {
        private readonly IUserRepository _userRepository;
        private readonly IContractService _contractService;

        public AuthorizationService(
            IUserRepository userRepository,
            IContractService contractService
        ) {
            _userRepository = userRepository;
            _contractService = contractService;
        }
        public GetAuthorizationResponse AddAuthorization(AuthorizationRequest request)
        {
            var owner = _userRepository.GetUserByAddress(request.OwnerId);
            var accessor = _userRepository.GetUserByAddress(request.AccessorId);

            if (owner == default)
                throw new NotFoundException("Owner Not Found");

            if (accessor == default)
                throw new NotFoundException("Accessor Not Found");

            var record = _userRepository.GetAllAuthorizationRecords()
                .FirstOrDefault(r => r.AccessorId == accessor.Id
                                    && r.OwnerId == owner.Id);

            if (record == default)
            {
                var newRecord = new AuthorizationRecord()
                {
                    OwnerId = owner.Id,
                    AccessorId = accessor.Id,
                    IsAuthorized = true,
                    AuthorizedDate = DateTime.UtcNow,
                };

                _userRepository.AddAuthorizationRecord(newRecord);
                _userRepository.SaveChanges();

                return new GetAuthorizationResponse()
                {
                    AccessorId = record.AccessorId,
                    AccessorKey = accessor.PublicKey,
                    Name = accessor.Name,
                    IsAuthorized = record.IsAuthorized,
                    AuthorizedDate = record.AuthorizedDate,
                };
           
            }

            record.IsAuthorized = true;
            record.AuthorizedDate = DateTime.UtcNow;

            var records = _userRepository.GetFileAuthorizationRecordsByAccessor(accessor.Id).ToList();

            records.ForAll(r => r.IsAuthorized = false);

            _userRepository.UpdateFileAuthorizationRecords(records);
            _userRepository.UpdateAuthorizationRecord(record);
            _userRepository.SaveChanges();

            return new GetAuthorizationResponse()
            {
                AccessorId = record.AccessorId,
                AccessorKey = accessor.PublicKey,
                Name = accessor.Name,
                IsAuthorized = record.IsAuthorized,
                AuthorizedDate = record.AuthorizedDate,
            };
        }

        public int RemoveAuthorization(AuthorizationRequest request)
        {
            var owner = _userRepository.GetUserByAddress(request.OwnerId);
            var accessor = _userRepository.GetUserByAddress(request.AccessorId);

            if (owner == default)
                throw new NotFoundException("Owner Not Found");

            if (accessor == default)
                throw new NotFoundException("Accesser Not Found");

            var record = _userRepository.GetAllAuthorizationRecords()
                .FirstOrDefault(r => r.AccessorId == accessor.Id
                                    && r.OwnerId == owner.Id);

            if (record == default)
                throw new NotFoundException("User has never been authorized");

            record.IsAuthorized = false;

            var records = _userRepository.GetFileAuthorizationRecordsByAccessor(accessor.Id).ToList();

            records.ForAll(r => r.IsAuthorized = false);

            _userRepository.UpdateFileAuthorizationRecords(records);
            _userRepository.UpdateAuthorizationRecord(record);
            _userRepository.SaveChanges();

            return record.Id;
        }

        public List<GetAuthorizationResponse> GetAuthorization(int userId)
        {
            var user = _userRepository.GetUserById(userId);
            var users = _userRepository.GetAllUsers();

            if (user == default)
                throw new NotFoundException("User not found");

            return _userRepository
                .GetAllAuthorizationRecords()
                .Where(r => r.OwnerId == userId && r.IsAuthorized == true)
                .Join(
                    users,
                    record => record.AccessorId,
                    user => user.Id,
                    (record, user) => new GetAuthorizationResponse()
                    {
                        AccessorId = record.AccessorId,
                        AccessorKey = user.PublicKey,
                        Name = user.Name,
                        IsAuthorized = record.IsAuthorized,
                        AuthorizedDate = record.AuthorizedDate,
                    }
                ).ToList();
        }

        public List<GetAllInformationResponse> GetAuthorizationRecordsByAccessor(int accessorId)
        {
            var records = _userRepository.GetAuthorizationRecordsByAccessor(accessorId);
            var users = _userRepository.GetAllUsers();

            return records.Join(
                users,
                record => record.OwnerId,
                user => user.Id,
                (record, user) => new GetAllInformationResponse()
                {
                    OwnerId = record.OwnerId,
                    Key = user.PublicKey,
                    UserName = user.Name,
                }).ToList();
        }

        public List<AuthorizationRecord> GetAllAuthorizationRecords()
        {
            return _userRepository.GetAllAuthorizationRecords().ToList();
        }

        public List<GetFileAuthorizationReponse> GetFileAuthorizationRecords(int fileId)
        {
            var users = _userRepository.GetAllUsers();

            var records = _userRepository.GetFileAuthorizationRecordsByFile(fileId);

            return records.Join(
                users,
                record => record.AccessorId,
                user => user.Id,
                (record, user) => new GetFileAuthorizationReponse()
                {
                    AccessorId = user.Id,
                    AccessorName = user.Name,
                    AuthorizedDate = record.AuthorizedDate
                }).ToList();
        }

        public void RemoveFileAuthorization(int recordId)
        {
            var record = _userRepository.GetFileAuthorizationRecord(recordId);

            if (record == null)
                throw new NotFoundException("Record Not Found");

            record.IsAuthorized = false;

            _userRepository.UpdateFileAuthorizationRecord(record);
            _userRepository.SaveChanges();
        }

        public void AddFileAuthorization(FileAuthorizationRequest request)
        {
            var owner = _userRepository.GetUserById(request.OwnerId);

            var accessor = _userRepository.GetUserById(request.AccessorId);

            var record = _userRepository.GetFileAuthorizationRecord(owner.Id, accessor.Id, request.FileId);

            if (record == null)
            {
                var newFileAuthorizationRecord = new FileAuthorizationRecord()
                {
                    AccessorId = accessor.Id,
                    OwnerId = owner.Id,
                    FileInformationId = request.FileId,
                    IsAuthorized = true,
                    AuthorizedDate = DateTime.UtcNow
                };

                _userRepository.AddFileAuthorizationRecord(newFileAuthorizationRecord);

            }
            else
            {
                record.AuthorizedDate = DateTime.UtcNow;
                record.IsAuthorized = true;

                _userRepository.UpdateFileAuthorizationRecord(record);
            }

            _userRepository.SaveChanges();
        }
    }
}

