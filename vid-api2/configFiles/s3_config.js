const S3 = require("@aws-sdk/client-s3");
const { fromIni } = require("@aws-sdk/credential-providers");

const bucketName = 'n11245409-assessment2'

const qutUsername = 'n11245409@qut.edu.au'
const qutUsername1 = 'n11328835@qut.edu.au'
const purpose = 'assessmen2'

const objectKey = 'test'
const objectValue = 'Test'

async function init_s3() {
  // Creating a client for sending commands to S3
  const s3Client = new S3.S3Client({
    region: 'ap-southeast-2',
    credentials: fromIni({ profile: 'CAB432-STUDENT-901444280953' })
  });

  // Command for creating a bucket
  let command = new S3.CreateBucketCommand({
    Bucket: bucketName
  });

  // Send the command to create the bucket
  try {
    const response = await s3Client.send(command);
    console.log(response.Location)
  } catch (err) {
    console.log(err);
  }
  command = new S3.PutBucketTaggingCommand({
    Bucket: bucketName,
    Tagging: {
      TagSet: [
        {
          Key: 'qut-username',
          Value: qutUsername,
        },
        {
          Key: 'qut-username1',
          Value: qutUsername1
        },
        {
          Key: 'purpose',
          Value: purpose
        }
      ]
    }
  });
  // Send the command to tag the bucket
  try {
    const response = await s3Client.send(command);
    console.log(response)
  } catch (err) {
    console.log(err);
  }

  // Create and send a command to write an object
  try {
    const response = await s3Client.send(
      new S3.PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        Body: objectValue
      })
    );
    console.log(response);
  } catch (err) {
    console.log(err);
  }

  // Create and send a command to read an object
  try {
    const response = await s3Client.send(
      new S3.GetObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
      })
    );
    // Transform the response's value to a string or other type.
    str = await response.Body.transformToString();
    console.log(str);
  } catch (err) {
    console.log(err);
  }
}

module.exports = init_s3;