using System.Numerics;
using WebAPI.Abstractions;
using WebAPI.Exceptions;
using WebAPI.Models;
using WebData.Abstractions;
using WebData.Models;

namespace WebAPI.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository) 
        {
            _userRepository = userRepository;
        }

        public Guid AddDoctor(AddDoctorRequest request)
        {
            var newDoctor = new Doctor()
            {
                Name = request.Name,
                Address = request.Address,
            };

            _userRepository.AddDoctor(newDoctor);

            _userRepository.SaveChanges();

            return newDoctor.Id;
        }

        public Guid AddPatient(AddPatientRequest request)
        {
            var newPatient = new Patient()
            {
                Name = request.Name,
                Address = request.Address,
                Sex = request.Sex,
                Age = request.Age,
                RegistrationDate = DateTime.UtcNow
            };

            _userRepository.AddPatient(newPatient);
            _userRepository.SaveChanges();  
            return newPatient.Id;
        }

        public GetDoctorResponse GetDoctor(Guid doctorId)
        {
            var doctor = _userRepository.GetDoctorById(doctorId);

            if (doctor == null)
            {
                throw new NotFoundException("Doctor not found");
            }

            return new GetDoctorResponse()
            {
                Id = doctor.Id,
                Name = doctor.Name,
            };
        }

        public GetPatientResponse GetPatient(Guid patientId)
        {
            var patient = _userRepository.GetDoctorById(patientId);

            if (patient == null)
            {
                throw new NotFoundException("Patient not found");
            }

            return new GetPatientResponse()
            {
                Id = patient.Id,
                Name = patient.Name,
            };
        }
    }
}
