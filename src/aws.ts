import AWS = require('aws-sdk');
import { config } from './config/config';
import request from 'request';

const c = config.dev;

//Configure AWS
// var credentials = new AWS.SharedIniFileCredentials({profile: config.dev.aws_profile});
// AWS.config.credentials = credentials;

//Configure AWS
if (c.aws_profile !== "DEPLOYED") {
  var credentials = new AWS.SharedIniFileCredentials({ profile: config.dev.aws_profile });
  AWS.config.credentials = credentials;
}

export const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: c.aws_region,
  params: { Bucket: c.aws_media_bucket }
});


/* getGetSignedUrl generates an aws signed url to retreive an item
 * @Params
 *    key: string - the filename to be put into the s3 bucket
 * @Returns:
 *    a url as a string
 */
export function getGetSignedUrl(key: string): string {

  const signedUrlExpireSeconds = 60 * 5

  const url = s3.getSignedUrl('getObject', {
    Bucket: c.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds
  });

  return url;
}

/* getPutSignedUrl generates an aws signed url to put an item
 * @Params
 *    key: string - the filename to be retreived from s3 bucket
 * @Returns:
 *    a url as a string
 */
export function getPutSignedUrl(key: string) {

  const signedUrlExpireSeconds = 60 * 5

  const url = s3.getSignedUrl('putObject', {
    Bucket: c.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds
  });

  return url;
}

/* uploadImage uploads an image to the aws s3 bucket
 * @Params
 *    key: string - the filename to be retreived from s3 bucket
 *    fileUrl: string - the image url 
 */
export function uploadImage(key: string, imageUrl: string) {

  var signedUrl = '';
  // Read content from the file url
  request.get("http://image-filter-final-code-dev.us-east-1.elasticbeanstalk.com/?image_url=" + imageUrl, (error, response, body) => {

    if (error) {
      console.log(error);
    } else if (response.statusCode === 200) {
      // let jsonBody = JSON.stringify(body)
      // console.dir(jsonBody);

      // const contentType = 'image/jpeg';
      // const blob = base64StringToBlob(body, contentType);

      // Setting up S3 upload parameters
      const params = {
        // ACL: "bucket-owner-full-control", 
        Bucket: c.aws_media_bucket,
        Key: key, // File name you want to save as in S3
        Body: body
      };

      // Uploading files to the bucket
      let res: AWS.S3.ManagedUpload = s3.upload(params, function (err: Error, data: AWS.S3.ManagedUpload.SendData) {
        if (err) {
          throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
      });
    } else {
      console.log(`response.statusCode = ${response.statusCode}`);
    }
  });
};
