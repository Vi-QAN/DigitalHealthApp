Hi everyone, as a graduate Vietnamese student in Computer Science living in Ireland, I'm starting a healthcare project built by the community for the community. This project aims to provide a platform where healthcare data such as electronic health records, lab results, and X-ray images can be exchanged, studied and discussed anonymously to improve patient experiences. 

This application can be used in the following scenarios:
- A temporary storage for e-health data so patients do not have to physically carry them from one hospital to another when seeking a second opinion.
- Medical test result delivery 
- A place where researchers can gather anonymous healthcare data for their research

This project is my final year research. I want to expand this into something beneficial for the community and provide a place for developers at any level to practice and learn, which I wish to have when I was in college. Joining the development of this project, you can practice designing, coding skills, doing code reviews, collaborating with others, and other essential skills you need. You can work on this project in your free time at your own pace since you can plan, design, and implement it as a team or by yourself.  

The project currently includes 

General services:
- Authentication and authorization services built based on blockchain technologies (Ganache - Ethereum Replica for local development, MetaMask wallet)
- Cryptographic service handles encryption and decryption of file's content being shared
- IPFS - InterPlanetary File System - a distributed file management system that handles sharing the actual content of shared data - uploaded files will have their hashes which are used for retrieval. 
- File information service keeps information about files (file hashes, etc) being shared 
- Notification service handles notification generation when actions such as opening, downloading, etc performed on a file
- Assistant service - a middleware service to interact with ChatGPT to provide in-app chatbot
- File service - a middleware service to interact with IPFS node to upload and download files, combined with HL7 service (mentioned later) and assistant service to extract and generate summaries of patient healthcare records.

Specialized services
- HL7 - health level 7 - this is a file extension that is used by several European countries to store and exchange e-healthcare data between hospitals. In this project, it is used to extract data to feed file service. This service can have multiple versions to be more compatible with different internal systems.

Front-end
- Mobile app - built with React Native expo - currently works on IOS - has integration with all mentioned services - supports in-app X-ray display
- Web app - built with React - has integration with only core services 

System design
- This system is designed to be highly decoupled with the aid of containerization and distributed computing. It contains a few core services that need to be strictly designed and implemented by the core team to ensure security whilst the remains can be freely customized to adapt to different scenarios.  
 
Technologies:
- IPFS
- SQL Server
- .NET framework
- Docker
- React Native Expo, React
Note: I’m open to any suggestions for technologies. Hence, for future features, the technology stack will be decided by the one who comes up with the idea.  

Upcoming work
- switching from blockchain to regular technologies for authentication and authorization
- building API gateway
- change current authentication flow in both web and mobile app

Future work
- rollout for customization for web app and mobile app

I'll need some joiners to work along with me on finishing upcoming work before rolling out for future development
