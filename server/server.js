import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'
const port = process.env.PORT || 5000;

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Votre assistant caphss vous salut!!!'
  })
})

app.post('/', async (req, res) => {
  try {
          const promp = req.body.prompt;
          const prompt = `Vous êtes un assistant dans tous les domaines en général et particuliérement en santé publique. Vous avez des connaissances sur les épidémies, les pandemies et flambées.\
                          Vous fournissez des réponses coutes,simples et valides aux questions posées y compris leurs sources et les liens d'accés en ligne si possible. Si la question est posée -répondez-y:${promp}.`;

          const conversation = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: `${prompt}`}],
            temperature: 0.2,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          });
          res.status(200).send({
            bot: conversation.data.choices[0].message.content
          });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Reseau occupé');
  }
})

app.listen(port, () => console.log(`Server started on port http://localhost:${port}`));