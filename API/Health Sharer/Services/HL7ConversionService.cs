using NHapi.Base.Model;
using NHapi.Base.Parser;
using HealthSharer.Models;

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

        public HL7ObservationResponseContent ProcessObservations(Varies[] varies)
        {
            HL7ObservationResponseContent result = new HL7ObservationResponseContent();
            List<string> values = new List<string>();

            foreach (var varie in varies)
            {
                var primitive = varie.Data as IPrimitive;

                if (primitive != null)
                {
                    values.Add(primitive.Value);
                }
            }

            result.ObservationValues = values;
            return result;
        }

        public GetHL7FileResponse ProcessHL7v24Message(string hl7Message)
        {
            var response = new GetHL7FileResponse();

            // Parse and process HL7 v2.4 message using NHAPI
            var adtMessage = parsedMessage as NHapi.Model.V24.Message.ADT_A05;

            if (adtMessage != null)
            {
                // Access specific segments and fields in v2.4 message
                string admissionReason = adtMessage.PV2.AdmitReason.Text.Value;
                List<string> allergies = new List<string>();
                List<string> diagnosises = new List<string>();

                foreach (var obx in adtMessage.OBXs)
                {
                    var observations = ProcessObservations(obx.GetObservationValue());
                }

                foreach (var al in adtMessage.AL1s)
                {
                    allergies.Add(al.AllergenCodeMnemonicDescription.Text.Value);
                }

                foreach (var dg in adtMessage.DG1s)
                {
                    diagnosises.Add(dg.DiagnosisDescription.Value);
                }

                // Implement further processing logic for v2.4
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

            var oruMessage = _pipeParser.Parse(hl7Message) as NHapi.Model.V24.Message.ORU_R01;
            if (oruMessage != null)
            {
                List<string> observations = new List<string>();

                foreach (var result in oruMessage.PATIENT_RESULTs)
                {
                    foreach (var oobservation in result.ORDER_OBSERVATIONs)
                    {
                        foreach (var observation in oobservation.OBSERVATIONs)
                        {
                            var content = ProcessObservations(observation.OBX.GetObservationValue());
                            observations.AddRange(content.ObservationValues);
                        }
                    }
                }

                var observationContent = new HL7ObservationResponseContent()
                {
                    ObservationValues = observations,
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

                foreach (var obx in adtMessage.OBXs)
                {
                    var observations = ProcessObservations(obx.GetObservationValue());
                }

                foreach (var al in adtMessage.AL1s)
                {
                    allergies.Add(al.AllergenCodeMnemonicDescription.Text.Value);
                }

                foreach (var dg in adtMessage.DG1s)
                {
                    diagnosises.Add(dg.DiagnosisDescription.Value);
                }

                // Implement further processing logic for v2.4
                var admissionResponse = new HL7AdmissionResponseContent()
                {
                    AdmissionReason = admissionReason,
                    Allergies = allergies,
                    Diagnosises= diagnosises,
                    MessageType = "Admission"
                };

                response.AdmissionContent = admissionResponse;
                return response;
            }

            var oruMessage = _pipeParser.Parse(hl7Message) as NHapi.Model.V281.Message.ORU_R01;
            if (oruMessage != null)
            {
                List<string> observations = new List<string>();

                foreach (var result in oruMessage.PATIENT_RESULTs)
                {
                    foreach (var oobservation in result.ORDER_OBSERVATIONs)
                    {
                        foreach (var observation in oobservation.OBSERVATIONs)
                        {
                            var content = ProcessObservations(observation.OBX.GetObservationValue());
                            observations.AddRange(content.ObservationValues);
                        }
                    }
                }

                var observationContent = new HL7ObservationResponseContent()
                {
                    ObservationValues = observations,
                    MessageType = "Observation"
                };

                response.ObservationContent = observationContent;
                return response;
            }

            return response;
        }
    }
}
