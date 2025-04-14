// Menggunakan CommonJS
const express = require("express");
const dialogflow = require("@google-cloud/dialogflow");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
const port = 3000;

// Menyajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

// Menentukan kredensial untuk Dialogflow
const credentials = {
  type: "service_account",
  project_id: "metal-ranger-425410-a9",
  private_key_id: "aa93137d4ef09db71eb1795a8c5e854a90164674",
  private_key: `-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----\n`,
  client_email:
    "dialogflow-service-account@metal-ranger-425410-a9.iam.gserviceaccount.com",
  client_id: "108478758335142832317",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/dialogflow-service-account%40metal-ranger-425410-a9.iam.gserviceaccount.com",
};

const sessionClient = new dialogflow.SessionsClient({ credentials });

// Membuat sesi baru dengan session ID yang unik
const projectId = "metal-ranger-425410-a9"; // Sesuaikan dengan Project ID Anda

// Endpoint untuk menerima permintaan input teks dan mengirimkan respons dari Dialogflow
app.post("/detect-intent", async (req, res) => {
  const text = req.body.text;
  const sessionId = uuidv4();
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: text,
        languageCode: "id",
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.json({
      fulfillmentText: result.fulfillmentText,
    });
  } catch (error) {
    console.error("Error during Dialogflow request:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Mulai server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
