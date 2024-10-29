Assignment 1 - Web Server - Response to Criteria
================================================

Instructions
------------------------------------------------
- Keep this file named A2_response_to_criteria.md, do not change the name
- Upload this file along with your code in the root directory of your project
- Upload this file in the current Markdown format (.md extension)
- Do not delete or rearrange sections.  If you did not attempt a criterion, leave it blank
- Text inside [ ] like [eg. S3 ] are examples and should be removed


Overview
------------------------------------------------

- **Name:** Shafi Uddin
- **Student number:** N11245409
- **Partner name (if applicable):** Ronil Rathod (N11328835)
- **Application name:** QUTube
- **Two line description:** Video sharing, streaming and transcoding website that uses S3, and RDS (mySQL) for all data storage.
- **EC2 instance name or ID:** i-0ab1367b7c6ba7f86

Core criteria
------------------------------------------------

### Core - First data persistence service

- **AWS service name:**  S3
- **What data is being stored?:** Raw video files
- **Why is this service suited to this data?:** Large files such as video data is best suited for blob storage like S3.
- **Why is are the other services used not suitable for this data?:** Services like MySQL and DynamoDB are meant to handle records than are small in size (individually)
- **Bucket/instance/table name:** n11245409-assessment2
- **Video timestamp:** 00:00
- **Relevant files:**
    - /vid-api2/configFiles/s3_config.js
    - /vid-api2/multerconfig.js

### Core - Second data persistence service

- **AWS service name:**  MySQL using RDS
- **What data is being stored?:** Video Metadata
- **Why is this service suited to this data?:** MySQL is an extremely effective way of storing structured records, such as video metadata. 
- **Why is are the other services used not suitable for this data?:** S3 is designed for large blob storage, dynamo is suitable for unstructured data, which can still be used, but for consistency, mySQL was chosen
- **Bucket/instance/table name:** n11245409-assessment2
- **Video timestamp:** 00:46
- **Relevant files:**
    - /vid-api2/knex_setup.js

### Third data service

- **AWS service name:**  [eg. RDS]
- **What data is being stored?:** [eg video metadata]
- **Why is this service suited to this data?:** [eg. ]
- **Why is are the other services used not suitable for this data?:** [eg. Advanced video search requires complex querries which are not available on S3 and inefficient on DynamoDB]
- **Bucket/instance/table name:**
- **Video timestamp:**
- **Relevant files:**
    -

### S3 Pre-signed URLs

- **S3 Bucket names:**
- **Video timestamp:**
- **Relevant files:**
    -

### In-memory cache

- **ElastiCache instance name:**
- **What data is being cached?:** [eg. Thumbnails from YouTube videos obatined from external API]
- **Why is this data likely to be accessed frequently?:** [ eg. Thumbnails from popular YouTube videos are likely to be shown to multiple users ]
- **Video timestamp:**
- **Relevant files:**
    - 


### Core - Statelessness

- **What data is stored within your application that is not stored in cloud data services?:** No data is stored in the application. All data is stored in S3, RDS, or parameter/secrets manager
- **Why is this data not considered persistent state?:** N/A
- **How does your application ensure data consistency if the app suddenly stops?:** All requests are handled independently and all required data is handled through API requests. If an error occurs, the client app (react app in this scenario) receives a message detailing the issue if possible.
- **Relevant files:**
    - /vid-api2/configFiles/s3_config.js
    - /vid-api2/multerconfig.js
    - /vid-api2/knex_setup.js

### Graceful handling of persistent connections

- **Type of persistent connection and use:** [eg. server-side-events for progress reporting]
- **Method for handling lost connections:** [eg. client responds to lost connection by reconnecting and indicating loss of connection to user until connection is re-established ]
- **Relevant files:**
    -


### Core - Authentication with Cognito

- **User pool name:** n11328835_assessment2 
- **How are authentication tokens handled by the client?:** After a successful login, the tokens (Access Token, ID Token, and Refresh Token) are returned from the server. The client stores these tokens directly in the browser's sessionStorage, Specifically sessionStorage.setItem.
- **Video timestamp:**
- **Relevant files:**
    - /vid-api2/middleware/authrization.js
    - /vid-api2/routes/user.js
    - /vidtranscode/src/pages/Register.jsx
    - /vidtranscode/src/pages/Login.jsx
    - /vidtranscode/src/pages/Home.jsx
    - /vidtranscode/src/pages/VideoUpload.jsx

### Cognito multi-factor authentication

- **What factors are used for authentication:** [eg. password, SMS code]
- **Video timestamp:**
- **Relevant files:**
    -

### Cognito federated identities

- **Identity providers used:**
- **Video timestamp:**
- **Relevant files:**
    -

### Cognito groups

- **How are groups used to set permissions?:** [eg. 'admin' users can delete and ban other users]
- **Video timestamp:**
- **Relevant files:**
    -

### Core - DNS with Route53

- **Subdomain**:  n11245409.cab432.com
- **Video timestamp:** 01:02


### Custom security groups

- **Security group names:** N11245409RDSSG, n11245409SG
- **Services/instances using security groups:** MySQL RDS, EC2 Instance
- **Video timestamp:** 01:23
- **Relevant files:**
    -

### Parameter store

- **Parameter names:** n11245409_YouTubeURL
- **Video timestamp:** 02:07
- **Relevant files:**
    - /vid-api2/configFiles/parameter.js


### Secrets manager

- **Secrets names:** n11245409-rdsCredentials, n11245409-youtubeAPI
- **Video timestamp:** 02:37
- **Relevant files:**
    - /vid-api2/configFiles/secrets.js

### Infrastructure as code

- **Technology used:**
- **Services deployed:**
- **Video timestamp:**
- **Relevant files:**
    -

### Other (with prior approval only)

- **Description:**
- **Video timestamp:**
- **Relevant files:**
    -

### Other (with prior permission only)

- **Description:**
- **Video timestamp:**
- **Relevant files:**
    -
