const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const client = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(file) {
  return client.files.upload({
    file: await toFile(file.buffer, file.originalname),
    fileName: file.originalname || "default",
    folder: "practice",
  });
}

module.exports = uploadFile;
