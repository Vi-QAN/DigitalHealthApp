using NHapi.Base.Model;
using NHapi.Base.Parser;
using HealthSharer.Models;
using Microsoft.AspNetCore.SignalR.Protocol;
using Azure;

namespace HealthSharer.Services
{
    public class HL7ConversionService
    {
        private readonly PipeParser _pipeParser = new();

        private IMessage? parsedMessage;
        private string? originalMessage;
        private string defaultFileVersion = "2.0";
        private string? _fileVersion;

        public string Message {
            get
            {
                if (originalMessage == null) {
                    return "Message is not set";
                }
                return originalMessage;
            }
            set
            {
                originalMessage = value;
                parsedMessage = _pipeParser.Parse(originalMessage);
                _fileVersion = parsedMessage.Version;
            }
        }

        public string FileVersion { 
            get { 
                if (_fileVersion == null)
                {
                    return defaultFileVersion;
                }
                return _fileVersion; 
            } }

        public HL7ConversionService() {}

        public List<Observation> ProcessObservations(Varies[] varies)
        {
            List<Observation> result = new List<Observation>();

            foreach (var varie in varies)
            {
                var primitive = varie.Data as IPrimitive;

                if (primitive != null)
                {
                    var newObservation = new Observation()
                    {
                        Value = primitive.Value,
                        Type = primitive.TypeName
                    };
                    result.Add(newObservation);
                }
            }
            return result;
        }

        public GetHL7FileResponse ProcessHL7v23Message(string hl7Message)
        {
            var response = new GetHL7FileResponse();

            var ormMessage = _pipeParser.Parse(hl7Message) as NHapi.Model.V23.Message.ORM_O01;
            if (ormMessage != null)
            {
                var patient = ormMessage.PATIENT.PID;
                var name = patient.GetPatientName()[0].FamilyName.Value + patient.GetPatientName()[0].GivenName.Value;
                var dob = patient.DateOfBirth.DegreeOfPrecision.Value;
                var sex = patient.Sex.Value;

                List<string> allergies = new List<string>();
                List<string> diagnosises = new List<string>();
                List<Observation> observations = new List<Observation>();

                foreach (var al in ormMessage.PATIENT.AL1s)
                {
                    allergies.Add(al.AllergyCodeMnemonicDescription.Text.Value);
                }

                foreach (var order in ormMessage.ORDERs)
                {
                    foreach (var dg in order.ORDER_DETAIL.DG1s)
                    {
                        diagnosises.Add(dg.DiagnosisDescription.Value);
                    }

                    foreach (var obx in order.ORDER_DETAIL.OBSERVATIONs)
                    {
                        var observation = ProcessObservations(obx.OBX.GetObservationValue());
                        observations.AddRange(observation);
                    }
                }

                // Implement further processing Logic for v2.4
                var orderEntryResponse = new HL7OrderEntryResponseContent()
                {
                    Allergies = allergies,
                    Diagnosises = diagnosises,
                    MessageType = "Order Entry",
                    Observations = observations,
                    PatientName = name,
                    Sex = sex,
                    DOB = $"{dob.Substring(0, 4)}/{dob.Substring(4,2)}/{dob.Substring(6,2)}"
                };

                response.OrderEntryContent = orderEntryResponse;
                return response;
            }

            return response;
        }

        public GetHL7FileResponse ProcessHL7v25Message(string hl7Message)
        {
            var response = new GetHL7FileResponse();

            var rdsMessage = _pipeParser.Parse(hl7Message) as NHapi.Model.V25.Message.RDS_O13;
            if (rdsMessage != null)
            {

                List<Transaction> transactions = new List<Transaction>();
                foreach (var order in rdsMessage.ORDERs)
                {
                    foreach (var transaction in order.FT1s)
                    {
                        var newTransaction = new Transaction()
                        {
                            Date = transaction.TransactionDate.RangeStartDateTime.Time.GetAsDate().Date.ToLocalTime().ToString(),
                            Currency = transaction.TransactionAmountExtended.Price.Denomination.Value,
                            Price = transaction.TransactionAmountExtended.Price.Quantity.Value,
                            Code = transaction.TransactionCode.Text.Value
                        };

                        transactions.Add(newTransaction);
                    }
                }
                var dispenseContent = new HL7PharmacyTreatmentDispenseResponseContent()
                {
                    Transactions = transactions,
                    MessageType = "Pharmacy/Treatment Dispense"
                };
                response.DispenseContent = dispenseContent;
                return response;
            }
            return response;
        }


        public GetHL7FileResponse ProcessHL7v24Message(string hl7Message)
        {
            var response = new GetHL7FileResponse();

            // Parse and process HL7 v2.4 message using NHAPI
            var adtAO5Message = _pipeParser.Parse(hl7Message) as NHapi.Model.V24.Message.ADT_A05;

            if (adtAO5Message != null)
            {
                // Access specific segments and fields in v2.4 message
                string admissionReason = adtAO5Message.PV2.AdmitReason.Text.Value;
                List<string> allergies = new List<string>();
                List<string> diagnosises = new List<string>();
                List<Observation> observations = new List<Observation>();

                var patient = adtAO5Message.PID;
                var name = patient.GetPatientName()[0].FamilyName.Surname.Value + " " + patient.GetPatientName()[0].GivenName.Value;
                var dob = patient.DateTimeOfBirth.TimeOfAnEvent.Value;
                var sex = patient.AdministrativeSex.Value;


                foreach (var obx in adtAO5Message.OBXs)
                {
                    var observation = ProcessObservations(obx.GetObservationValue());
                    observations.AddRange(observation);
                }

                foreach (var al in adtAO5Message.AL1s)
                {
                    allergies.Add(al.AllergenCodeMnemonicDescription.Text.Value);
                }

                foreach (var dg in adtAO5Message.DG1s)
                {
                    diagnosises.Add(dg.DiagnosisDescription.Value);
                }

                // Implement further processing Logic for v2.4
                var admissionResponse = new HL7AdmissionResponseContent()
                {
                    AdmissionReason = admissionReason,
                    Allergies = allergies,
                    Diagnosises = diagnosises,
                    MessageType = "Admission",
                    Observations = observations,
                    PatientName = name,
                    Sex = sex,
                    DOB = $"{dob.Substring(0, 4)}/{dob.Substring(4, 2)}/{dob.Substring(6, 2)}"
                };

                response.AdmissionContent = admissionResponse;
                return response;
            }

            var oruMessage = _pipeParser.Parse(hl7Message) as NHapi.Model.V24.Message.ORU_R01;
            if (oruMessage != null)
            {
                List<Observation> observations = new List<Observation>();

                foreach (var result in oruMessage.PATIENT_RESULTs)
                {
                    foreach (var oobservation in result.ORDER_OBSERVATIONs)
                    {
                        foreach (var observation in oobservation.OBSERVATIONs)
                        {
                            var o = ProcessObservations(observation.OBX.GetObservationValue());
                            observations.AddRange(o);
                        }
                    }
                }

                var observationContent = new HL7ObservationResultResponseContent()
                {
                    Observations = observations,
                    MessageType = "Observation Result"
                };

                response.ObservationContent = observationContent;
                return response;
            }

            

            return response;
        }


        public GetHL7FileResponse ProcessHL7v281Message(string hl7Message)
        {
            var response = new GetHL7FileResponse();

            // Parse and process HL7 v2.4 message using NHAPI
            var adtMessage = parsedMessage as NHapi.Model.V281.Message.ADT_A05;

            if (adtMessage != null)
            {
                // Access specific segments and fields in v2.4 message
                string admissionReason = adtMessage.PV2.AdmitReason.Text.Value;
                List<string> allergies = new List<string>();
                List<string> diagnosises = new List<string>();
                List<Observation> observations = new List<Observation>();

                foreach (var obx in adtMessage.OBXs)
                {
                    observations = ProcessObservations(obx.GetObservationValue());
                }

                foreach (var al in adtMessage.AL1s)
                {
                    allergies.Add(al.AllergenCodeMnemonicDescription.Text.Value);
                }

                foreach (var dg in adtMessage.DG1s)
                {
                    diagnosises.Add(dg.DiagnosisDescription.Value);
                }

                // Implement further processing Logic for v2.4
                var admissionResponse = new HL7AdmissionResponseContent()
                {
                    AdmissionReason = admissionReason,
                    Allergies = allergies,

                    Diagnosises = diagnosises,
                    MessageType = "Admission"
                };

                response.AdmissionContent = admissionResponse;
                return response;
            }

            var oruMessage = _pipeParser.Parse(hl7Message) as NHapi.Model.V281.Message.ORU_R01;
            if (oruMessage != null)
            {
                List<Observation> observations = new List<Observation>();

                foreach (var result in oruMessage.PATIENT_RESULTs)
                {
                    foreach (var oobservation in result.ORDER_OBSERVATIONs)
                    {
                        foreach (var observation in oobservation.OBSERVATIONs)
                        {
                            observations = ProcessObservations(observation.OBX.GetObservationValue());

                        }
                    }
                }

                var observationContent = new HL7ObservationResultResponseContent()
                {
                    Observations = observations,
                    MessageType = "Observation"
                };

                response.ObservationContent = observationContent;
                return response;
            }

            return response;
        }
    }
}
