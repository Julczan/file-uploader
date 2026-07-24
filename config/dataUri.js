const DatauriParser = require("datauri/parser");
const path = require("node:path");
const parser = new DatauriParser();

exports.dataUri = (req) =>
  parser.format(
    path.extname(req.file.originalname).toString(),
    req.file.buffer,
  );
