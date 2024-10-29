const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const { fromIni } = require("@aws-sdk/credential-providers");


// Function to retrieve secrets from AWS Secrets Manager
async function RetrieveSecret(requestedSecret) {
    console.log("retrive secret function invoked");
    console.log("passed secret is ", requestedSecret);
    if (typeof fromIni !== 'function') {
        throw new Error('fromIni is not loaded correctly.');
    }

    const client = new SecretsManagerClient({ 
        region: "ap-southeast-2",
        credentials: fromIni({ profile: 'CAB432-STUDENT-901444280953' })
    });
    
    const command = new GetSecretValueCommand({ SecretId: requestedSecret });
    try {
        const response = await client.send(command);
        const secret = JSON.parse(response.SecretString);
        console.log(secret.youtubeAPIKey);
        return secret;
    } catch (error) {
        console.error("Failed to retrieve secret", error);
        throw error;
    }
}

module.exports = RetrieveSecret;