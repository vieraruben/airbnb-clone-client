const dev = {
  s3: {
    REGION: "us-east-2",
    BUCKET: "airbnb-clone-api-dev-attachmentsbucket-12fkuz1f25onv" //"airbnb-clone-attachment-bucket"
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://0vj0bu2g8g.execute-api.us-east-2.amazonaws.com/dev/api"
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_bIdkgy4Jt",
    APP_CLIENT_ID: "2jkh9ev5nmecdh94o2ltg7o84q",
    IDENTITY_POOL_ID: "us-east-2:0fd02e1c-5120-4368-bcfe-5cb5abe55e88"
  }
};

// Default to dev if not set
const config = dev;
//process.env.REACT_APP_STAGE
export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};
