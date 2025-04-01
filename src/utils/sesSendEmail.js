const SendEmailCommand = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: "<h1>You just received a connection request. Login to see who!!</h1>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "You just received a connection request. Login to see who!!",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "New Person interested!!",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async (toAddress, fromAddress) => {
  const sendEmailCommand = createSendEmailCommand(toAddress, fromAddress);

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports = { run };
