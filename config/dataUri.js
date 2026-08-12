const fileType = require("file-type");

exports.processUnknownBuffer = async (buffer) => {
  const typeInfo = await fileType.fileTypeFromBuffer(buffer);

  const mimeType = typeInfo ? typeInfo.mime : "application/octet-stream";

  return `data:${mimeType};base64,${buffer.toString("base64")}`;
};
