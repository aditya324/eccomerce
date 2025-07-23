import express from 'express';

import AWS from 'aws-sdk';

import { v4 as uuidv4 } from 'uuid';

import 'dotenv/config'; // Make sure to import dotenv to load environment variables

const router = express.Router();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: 'v4',
});


router.get('/get-presigned-url', async (req, res) => {
  try {
    const { fileName, fileType } = req.query;

    if (!fileName || !fileType) {
      return res.status(400).json({ message: "fileName and fileType query parameters are required." });
    }


    const fileExtension = fileName.split('.').pop();
    const key = `services/${uuidv4()}.${fileExtension}`;

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Expires: 60, 
      ContentType: fileType,
    };

    // Get the pre-signed URL from S3
    const uploadUrl = await s3.getSignedUrlPromise("putObject", s3Params);

    res.status(200).json({
      uploadUrl,
      key, // The key is the path to the file in the bucket
    });

  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    res.status(500).json({ message: "Error generating pre-signed URL" });
  }
});

export default router;