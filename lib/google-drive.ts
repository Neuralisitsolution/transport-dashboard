import { google } from 'googleapis';
import { Readable } from 'stream';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

function getAuth() {
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error('Google Drive credentials not configured');
  }

  return new google.auth.JWT(clientEmail, undefined, privateKey, SCOPES);
}

const SUBFOLDER_MAP: Record<string, string> = {
  CommercialSlips: 'CommercialSlips',
  PrivateSlips: 'PrivateSlips',
  PaymentScreenshots: 'PaymentScreenshots',
};

async function getOrCreateSubfolder(
  drive: ReturnType<typeof google.drive>,
  parentId: string,
  folderName: string
): Promise<string> {
  const res = await drive.files.list({
    q: `name='${folderName}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id)',
  });

  if (res.data.files && res.data.files.length > 0) {
    return res.data.files[0].id!;
  }

  const folder = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    },
    fields: 'id',
  });

  return folder.data.id!;
}

export async function uploadToGoogleDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  subfolder: 'CommercialSlips' | 'PrivateSlips' | 'PaymentScreenshots'
): Promise<{ fileId: string; viewUrl: string }> {
  const auth = getAuth();
  const drive = google.drive({ version: 'v3', auth });

  const parentFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!parentFolderId) {
    throw new Error('Google Drive folder ID not configured');
  }

  const subFolderName = SUBFOLDER_MAP[subfolder];
  const subFolderId = await getOrCreateSubfolder(drive, parentFolderId, subFolderName);

  const stream = new Readable();
  stream.push(fileBuffer);
  stream.push(null);

  const file = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [subFolderId],
    },
    media: {
      mimeType,
      body: stream,
    },
    fields: 'id',
  });

  const fileId = file.data.id!;

  // Make file publicly viewable
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  const viewUrl = `https://drive.google.com/file/d/${fileId}/view`;

  return { fileId, viewUrl };
}
