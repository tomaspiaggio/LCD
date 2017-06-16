// Google Speech to Text
// Imports the Google Cloud client library
const Speech = require('@google-cloud/speech');

// Your Google Cloud Platform project ID
const projectId = 'lycd-b6124';

// Instantiates a client
const speechClient = Speech({
  projectId: projectId
});

// The name of the audio file to transcribe
const fileName = './test.wav';

// The audio file's encoding, sample rate in hertz, and BCP-47 language code
const options = {
  encoding: 'LINEAR16',
  sampleRateHertz: 44100,
  languageCode: 'es-AR'
};

// Detects speech in the audio file
speechClient.recognize(fileName, options)
  .then((results) => {
    const transcription = results[0];
    console.log(`Transcription: ${transcription}`);
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });
