const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Cognito = require('@aws-sdk/client-cognito-identity-provider');
const jwtVerify = require("aws-jwt-verify");

const authorization = require("../middleware/authorization");

const clientId = "3oftl8de0ci8b4sf40ceu0a1p8"; // From AWS console
const userPoolId = "ap-southeast-2_EfajoU5aB"; // From AWS console

// Cognito client
const cognitoClient = new Cognito.CognitoIdentityProviderClient({ region: 'ap-southeast-2' });

// Verifiers for Cognito tokens
const accessVerifier = jwtVerify.CognitoJwtVerifier.create({
  userPoolId: userPoolId,
  tokenUse: "access",
  clientId: clientId,
});

const idVerifier = jwtVerify.CognitoJwtVerifier.create({
  userPoolId: userPoolId,
  tokenUse: "id",
  clientId: clientId,
});

/* GET users listing. */
router.get('/', function (req, res) {
  res.send('respond with a resource');
});

/**
 * Authentication endpoints:
 * /login
 * /register
 */

// REGISTER (Cognito Sign Up)
router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      error: true,
      message: "Request body incomplete: email, password, firstName, and lastName are required."
    });
  }

  try {
    const command = new Cognito.SignUpCommand({
      ClientId: clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "name", Value: firstName },      // Use standard attribute for first name
        { Name: "family_name", Value: lastName } // Use standard attribute for last name
      ],
    });
    const response = await cognitoClient.send(command);
    res.status(201).json({ success: true, message: "User created", response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CONFIRM SIGN UP
router.post('/confirm-signup', async (req, res) => {
  const { email, confirmationCode } = req.body;

  if (!email || !confirmationCode) {
    return res.status(400).json({
      error: true,
      message: "Email and confirmation code are required."
    });
  }

  try {
    const command = new Cognito.ConfirmSignUpCommand({
      ClientId: clientId,
      Username: email,
      ConfirmationCode: confirmationCode,
    });
    const response = await cognitoClient.send(command);
    res.status(200).json({ success: true, message: "User confirmed", response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// LOGIN (Cognito Authentication)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "Request body incomplete - email and password needed"
    });
  }

  try {
    const command = new Cognito.InitiateAuthCommand({
      AuthFlow: Cognito.AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
      ClientId: clientId,
    });

    const response = await cognitoClient.send(command);
    const { IdToken, AccessToken, RefreshToken } = response.AuthenticationResult;

    // Verify the tokens
    const idTokenVerified = await idVerifier.verify(IdToken);
    const accessTokenVerified = await accessVerifier.verify(AccessToken);

    // Return the tokens (ID token, Access token, and Refresh token) to the client
    res.status(200).json({
      success: true,
      message: "Login successful",
      idToken: IdToken, 
      accessToken: AccessToken, 
      refreshToken: RefreshToken
    });
  } catch (error) {
    res.status(401).json({
      error: true,
      message: error.message
    });
  }
});

/**
 * Profile endpoints using JWT authorization
 * /user/{email}/profile (get request)
 * /user/{email}/profile (put request)
 */

// Get User Profile
router.get("/:email/profile", authorization, function (req, res, next) {
  const email = req.params.email;

  // Fields to be returned
  let fields = ["email", "firstName", "lastName"];
  const authFields = ["dob", "address"];
  let tokenEmail = null;

  // If user is authenticated, add more fields
  if (req.authenticated) {
    fields = fields.concat(authFields);
    tokenEmail = req.token.email;
  }

  // Fetch user data
  req.db.from("users").select(fields).where("email", "=", email)
    .then((rows) => {
      if (rows.length === 0) {
        return res.status(404).json({ "error": true, "message": "User not found" });
      } else {
        const result = rows.map(row => ({
          "email": row.email,
          "firstName": row.firstName,
          "lastName": row.lastName,
          ...(req.authenticated && email === tokenEmail && {
            "dob": row.dob || null,
            "address": row.address || null
          })
        }));
        return res.status(200).json(result[0]);
      }
    });
});

// Update User Profile
router.put("/:email/profile", authorization, function (req, res, next) {
  const email = req.params.email;
  const userData = req.body;

  const requiredFields = ["firstName", "lastName", "dob", "address"];

  // Verify if user is authenticated
  if (!req.authenticated) {
    return res.status(401).json({ "error": true, "message": "Authorization header ('Bearer token') not found" });
  }

  // Ensure that email in token matches the supplied email
  if (email !== req.token.email) {
    return res.status(403).json({ "error": true, "message": "Forbidden" });
  }

  // Check if all required fields are supplied
  for (const field of requiredFields) {
    if (!(field in userData)) {
      return res.status(400).json({ "error": true, "message": "Request body incomplete: firstName, lastName, dob, and address are required." });
    }
  }

  // Validate date format
  const [year, month, day] = userData.dob.split('-');
  const actualDate = new Date(year, month - 1, day);
  const currentDate = new Date();
  const isValidDate = actualDate.getFullYear() === parseInt(year) &&
                      actualDate.getMonth() === month - 1 &&
                      actualDate.getDate() === parseInt(day);

  if (!isValidDate || actualDate.getTime() > currentDate.getTime()) {
    return res.status(400).json({ error: true, message: 'Invalid input: dob must be a real date in the past and in format YYYY-MM-DD.' });
  }

  // Update user details
  const updateFields = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    dob: userData.dob,
    address: userData.address
  };

  try {
    req.db('users').where("email", "=", email).update(updateFields)
      .then(_ => {
        req.db('users').select("*").where("email", "=", email)
          .then(rows => {
            const result = rows.map(row => ({
              email: row.email,
              firstName: row.firstName,
              lastName: row.lastName,
              dob: row.dob,
              address: row.address
            }));
            return res.status(200).json(result[0]);
          });
      });
  } catch (dbError) {
    res.status(500).json({ success: false, message: 'Database error', error: dbError });
  }
});

module.exports = router;
