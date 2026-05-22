const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
let sharp;
try { sharp = require('sharp'); } catch (e) { sharp = null; }

const S3_BUCKET = process.env.S3_BUCKET;
const USE_S3 = process.env.USE_S3 === 'true';

if (USE_S3 && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });
}

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) return res.status(400).json({ message: 'No file uploaded' });

    const mime = req.file.mimetype || 'application/octet-stream';
    if (!mime.startsWith('image/')) return res.status(400).json({ message: 'Only images allowed' });

    let buffer = req.file.buffer;
    if (sharp) {
      buffer = await sharp(buffer).resize({ width: 1024 }).jpeg({ quality: 85 }).toBuffer();
    }

    const ext = path.extname(req.file.originalname) || '.jpg';
    const key = `images/${Date.now()}-${Math.random().toString(36).slice(2,10)}${ext}`;

    if (USE_S3 && S3_BUCKET) {
      const s3 = new AWS.S3();
      const params = {
        Bucket: S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: mime,
        ACL: 'public-read'
      };
      const uploaded = await s3.upload(params).promise();
      return res.json({ url: uploaded.Location, key });
    }

    const uploadsDir = path.join(__dirname, '..', 'uploads', 'images');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const outPath = path.join(uploadsDir, path.basename(key));
    fs.writeFileSync(outPath, buffer);
    const url = `/uploads/images/${path.basename(key)}`;
    return res.json({ url, key });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Upload failed' });
  }
};

exports.presignUpload = async (req, res) => {
  try {
    if (!USE_S3 || !S3_BUCKET) return res.status(400).json({ message: 'S3 not configured' });

    const { filename, contentType } = req.body;
    if (!filename || !contentType) return res.status(400).json({ message: 'filename and contentType required' });
    if (!contentType.startsWith('image/')) return res.status(400).json({ message: 'Only image content types allowed' });

    const key = `images/presigned-${Date.now()}-${Math.random().toString(36).slice(2,8)}-${filename}`;
    const s3 = new AWS.S3();
    const params = {
      Bucket: S3_BUCKET,
      Key: key,
      Expires: 60 * 5,
      ContentType: contentType,
      ACL: 'public-read'
    };
    const url = s3.getSignedUrl('putObject', params);
    res.json({ url, key, publicUrl: `https://${S3_BUCKET}.s3.amazonaws.com/${key}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Presign failed' });
  }
};
