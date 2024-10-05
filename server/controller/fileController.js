/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const {google} = require('googleapis')


const REDIRECT_URI = 'https://developers.google.com/oauthplayground'

// const CLIENT_ID = '232213362716-cdmd43i0aglcnlhv1f0d19e75oattmf6.apps.googleusercontent.com'
// const CLIENT_SECRET = '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'
// const REFRESH_TOKEN ='1//04rtuF8E_yxTwCgYIARAAGAQSNwF-L9IrfmKDxgxKSR6K-FNwfQJLygj9JDue5GyCewkbQkjyY2MH9ZTSYVQ3gKWP5wX-HAPrn_A'

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
)

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
})

exports.uploadFile = async (req, res) => {
  console.log("test" ,req.file)
  try {
    
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const folderName = 'petshop'; // Replace with your desired folder name

    // Get the folder ID for the specified folderName
    const folderResponse = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
    });

    if (folderResponse.data.files.length === 0) {
      console.error(`Folder '${folderName}' not found.`);
      return res.status(404).json({ error: `Folder '${folderName}' not found.` });
    }

    console.log(folderResponse.data.files[0])

    const folderId = folderResponse.data.files[0].id;
    const fileData = req.file;

    const fileStream = require('stream').Readable.from(fileData.buffer);

    const response = await drive.files.create({
      requestBody: {
        name: setRandomNumber(), 
        mimeType: fileData.mimetype,
        parents: [folderId],
      },
      media: {
        mimeType: fileData.mimetype,
        body: fileStream, 
      },
    });

    // Get the file ID from the response
    const fileId = response.data.id;

    // Call setUrlPublic to set the public URL for the file
    await exports.setUrlPublic(fileId);

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while uploading the file.' });
  }
};



exports.deleteFile = async function (){
    try {
        const response = await drive.files.delete({
            fileId: '1A5ocQLwjGHT11n4ltXn3Qtd-gQNei3bm'
        })
        console.log(response.data, response.status)
    } catch (error) {
        console.log(error.message)
    }
}


exports.generatePublicUrl = async function (fileId){
    try {
        // const fileId = '1FVGZOGhcH4YnzTdGp5CUKG7wxFyQwgJS'
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        })

        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink'
        })

        console.log(result.data)
    } catch (error) {
        console.log(error.message)
    } 
}

exports.setUrlPublic = async function (fileId){
  try {
      await drive.permissions.create({
          fileId: fileId,
          requestBody: {
              role: 'reader',
              type: 'anyone'
          }
      })
      const result = await drive.files.get({
          fileId: fileId,
          fields: 'webViewLink, webContentLink'
      })
      return result

  } catch (error) {
      console.log(error.message)
  } 
}

// uploadFile()
// deleteFile() 
// generatePublicUrl()


function setRandomNumber() {
  // Generate a random 5-digit number
  const randomNum = Math.floor(Math.random() * 90000) + 10000;

  // Get the current date and time
  const currentDate = new Date();

  // Format the date and time as a string
  const formattedDate = currentDate.toISOString().replace(/[-T:.Z]/g, '');

  // Combine the random number and formatted date/time
  const result = `${randomNum}-${formattedDate}`;

  return result;
}

