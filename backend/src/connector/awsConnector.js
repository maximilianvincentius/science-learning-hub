import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

class AWSConnector {
  constructor(s3Client) {
    this._s3Client = s3Client;

    this.getObjectCommand = this.getObjectCommand.bind(this);
  }

  async getObjectCommand(subCourseId) {
    const command = new GetObjectCommand({
      Bucket: 'amzn-s3-science-learning-hub',
      Key: `courses/${subCourseId}.pdf`,
      ResponseContentDisposition: 'inline',
    });

    return getSignedUrl(this._s3Client, command);
  }
}

module.exports = AWSConnector;
