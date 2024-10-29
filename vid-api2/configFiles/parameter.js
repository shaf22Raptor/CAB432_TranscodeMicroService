const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

async function getParameter(paramName) {
    const ssmClient = new SSMClient({ region: "ap-southeast-2" });

    try {
        const command = new GetParameterCommand({
            Name: paramName
        });

        const response = await ssmClient.send(command);
        console.log(`Parameter value: ${response.Parameter.Value}`);
        return response.Parameter.Value;
    } catch (err) {
        console.error(`Error retrieving parameter: ${err}`);
    }
}

module.exports = getParameter;