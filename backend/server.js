const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://dhamo1899:Dhamu1899@kyro.khyxxgz.mongodb.net/?retryWrites=true&w=majority&appName=Kyro', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define schemas and models
const similarUserSchema = new mongoose.Schema({
  username: String
});

const wordFrequencySchema = new mongoose.Schema({
  word: String,
  frequency: Number
});

const transcriptionSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const SimilarUser = mongoose.model('SimilarUser', similarUserSchema);
const WordFrequency = mongoose.model('WordFrequency', wordFrequencySchema);
const Transcription = mongoose.model('Transcription', transcriptionSchema);

// Routes
app.get('/similar-users', async (req, res) => {
  try {
    const users = await SimilarUser.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching similar users:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/word-frequencies', async (req, res) => {
  try {
    const frequencies = await WordFrequency.find();
    res.status(200).json(frequencies);
  } catch (error) {
    console.error('Error fetching word frequencies:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/transcriptions', async (req, res) => {
  try {
    const { transcription } = req.body;
    if (!transcription) {
      return res.status(400).send('Transcription is required');
    }

    const newTranscription = new Transcription({ text: transcription });
    await newTranscription.save();

    const words = transcription.split(' ');
    for (const word of words) {
      const existingWord = await WordFrequency.findOne({ word });
      if (existingWord) {
        existingWord.frequency += 1;
        await existingWord.save();
      } else {
        const newWord = new WordFrequency({ word, frequency: 1 });
        await newWord.save();
      }
    }

    res.status(201).send('Transcription added and word frequencies updated');
  } catch (error) {
    console.error('Error adding transcription:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/transcriptions', async (req, res) => {
  try {
    const transcriptions = await Transcription.find();
    res.status(200).json(transcriptions);
  } catch (error) {
    console.error('Error fetching transcriptions:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
