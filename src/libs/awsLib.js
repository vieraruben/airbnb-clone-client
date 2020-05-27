import { Storage } from "aws-amplify";

export async function s3Upload(file) {
  const filename = `${Date.now()}-${file.name}`;
  try {
    await Storage.put(filename, file);
  }catch (e) {
  }
  return filename
}
