/*const { Storage } = require("@google-cloud/storage");
const path = require("path");
require("dotenv").config();

const storage = new Storage({
  keyFilename: path.join(__dirname, "service-account.json"),
});

const bucketName = process.env.GCS_BUCKET;
if (!bucketName) {
  throw new Error("GCS_BUCKET environment variable is not set!");
}

const bucket = storage.bucket(bucketName);

// Upload a file to GCS in a specific folder
async function uploadFileToGCS(file, folder = "images") {
  return new Promise((resolve, reject) => {
    if (!file) return reject("No file provided");

    const fileName = `${folder}/${Date.now()}_${file.originalname}`;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({ resumable: false });

    blobStream.on("error", (err) => reject(err));
    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
}

// List files from a folder (prefix)
async function listFilesFromGCS(prefix = "images/") {
  const [files] = await bucket.getFiles({ prefix });
  return files.map(file => ({
    name: file.name.replace(prefix, ""),
    url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
  }));
}

module.exports = {
  uploadFileToGCS,
  listFilesFromGCS,
};
*/

const { Storage } = require("@google-cloud/storage");
const path = require("path");
require("dotenv").config();

const storage = new Storage({
  keyFilename: path.join(__dirname, "service-account.json"),
});

const bucketName = process.env.GCS_BUCKET;
if (!bucketName) {
  throw new Error("GCS_BUCKET environment variable is not set!");
}

const bucket = storage.bucket(bucketName);

// Upload a file to GCS in a specific folder
async function uploadFileToGCS(file, folder = "images") {
  return new Promise((resolve, reject) => {
    if (!file) return reject("No file provided");

    const fileName = `${folder}/${Date.now()}_${file.originalname}`;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({ resumable: false });

    blobStream.on("error", (err) => reject(err));
    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
}

// List files from a folder (prefix)
async function listFilesFromGCS(prefix = "") {
  const [files] = await bucket.getFiles({ prefix });
  return files.map((file) => ({
    name: file.name.split("/").pop(),
    url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
    uploadedAt: file.metadata.timeCreated,
  }));
}

module.exports = {
  uploadFileToGCS,
  listFilesFromGCS,
};
