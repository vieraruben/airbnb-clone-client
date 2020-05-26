import { Storage } from "aws-amplify";

export async function s3Upload(file) {
  const filename = `${Date.now()}-${file.name}`;

  // console.log('filename ' + filename)
  // console.log('file ' + file)
  // console.log('contentType ' + file.type)
  // const stored = await Storage.put(filename, file);
  // return stored.key;
  return 'Test'
}
