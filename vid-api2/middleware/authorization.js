const { CognitoJwtVerifier } = require('aws-jwt-verify');

// Define the Cognito JWT verifier for ID tokens and access tokens
const idVerifier = CognitoJwtVerifier.create({
  userPoolId: "ap-southeast-2_EfajoU5aB", // From AWS console
  tokenUse: "id", // ID tokens
  clientId: "3oftl8de0ci8b4sf40ceu0a1p8" // From AWS console
});

const accessVerifier = CognitoJwtVerifier.create({
  userPoolId: "ap-southeast-2_EfajoU5aB", 
  tokenUse: "access", // Access tokens
  clientId: "3oftl8de0ci8b4sf40ceu0a1p8" 
});

module.exports = async function (req, res, next) {
    // Check if the Authorization header is malformed
    if ("authorization" in req.headers && !req.headers.authorization.match(/^Bearer /)) {
        return res.status(401).json({ error: true, message: "Authorization header is malformed" });
    }

    // Check if the user is authenticated by verifying the token
    if (!("authorization" in req.headers) || !req.headers.authorization.match(/^Bearer /)) {
        req.authenticated = false;
        console.log("Authorization not found");
    } else {
        // Collect token
        const token = req.headers.authorization.replace(/^Bearer /, "");

        try {
            // Attempt to verify the token as an ID token
            const decodedIdToken = await idVerifier.verify(token);
            req.authenticated = true;
            req.token = decodedIdToken;
            next(); // If verification is successful, proceed
        } catch (idTokenError) {
            console.log('ID token verification failed:', idTokenError.message);
            
            // If ID token fails, try verifying as an access token
            try {
                const decodedAccessToken = await accessVerifier.verify(token);
                req.authenticated = true;
                req.token = decodedAccessToken;
                next(); // If verification is successful, proceed
            } catch (accessTokenError) {
                console.log('Access token verification failed:', accessTokenError.message);
                return res.status(401).json({ error: true, message: "Invalid or expired JWT token" });
            }
        }
    }
};