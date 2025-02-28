const { S3Client, PutObjectCommand } = require ("@aws-sdk/client-s3");
const fs = require ("fs");
const path = require ("path");
const dotenv = require ("dotenv");

dotenv.config(); // Load AWS credentials from .env file

const s3 = new S3Client({ region: process.env.AWS_REGION });

function determineContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const contentTypes = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.txt': 'text/plain',
      '.html': 'text/html',
      '.csv': 'text/csv',
      '.json': 'application/json',
      '.xml': 'application/xml',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };

  return contentTypes[extension] || 'application/octet-stream';
}
async function uploadFileToS3(bucketName, localBaseFolder, localRelativePath) {
  try {
      // Construct the full local file path
      const fullLocalPath = path.join(localBaseFolder, localRelativePath);

      // Check if file exists
      if (!fs.existsSync(fullLocalPath)) {
          throw new Error(`File not found at path: ${fullLocalPath}`);
      }

      // Read the file
      const fileContent = fs.readFileSync(fullLocalPath);

      // Determine the content type based on file extension
      const contentType = determineContentType(fullLocalPath);

      // Create the upload parameters
      const uploadParams = {
          Bucket: bucketName,
          Key: localRelativePath.replace(/\\/g, '/'), // Ensure forward slashes for S3 path
          Body: fileContent,
          ContentType: contentType
      };

      // Upload to S3
      const command = new PutObjectCommand(uploadParams);
      const response = await s3.send(command);

      console.log(`Successfully uploaded ${localRelativePath} to S3`);
      return response;
  } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
  }
}
async function uploadFolderToS3(localPath, s3Prefix) {
  const files = fs.readdirSync(localPath);
  console.log("Copy localpath", localPath)
  for (const file of files) {
    const filePath = path.join(localPath, file);
    const fileKey = path.join(s3Prefix, file).replace(/\\/g, "/");
    console.log("copy file", filePath)
    if (fs.statSync(filePath).isFile()) {
      try {
        const fileContent = fs.readFileSync(filePath);
        await s3.send(new PutObjectCommand({ 
          Bucket: bucketName, 
          Key: fileKey, 
          Body: fileContent 
        }));
        console.log(`Uploaded: ${fileKey}`);
      } catch (err) {
        console.error(`Failed to upload ${fileKey}:`, err);
      }
    }
  }
}


module.exports =  {uploadFileToS3}