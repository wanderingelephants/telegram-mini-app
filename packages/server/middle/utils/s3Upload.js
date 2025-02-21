const { S3Client, PutObjectCommand } = require ("@aws-sdk/client-s3");
const fs = require ("fs");
const path = require ("path");
const dotenv = require ("dotenv");

dotenv.config(); // Load AWS credentials from .env file

const bucketName = process.env.S3_BUCKET_NAME; // Define in .env
const folderPath = process.argv[2];

if (!folderPath || !bucketName) {
  console.error("Usage: node uploadToS3.js <source-folder>");
  process.exit(1);
}

const s3 = new S3Client({ region: process.env.AWS_REGION });

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

const s3TargetPath = folderPath.replace(/^.*pdfs\//, "");
uploadFolderToS3(folderPath, s3TargetPath);
