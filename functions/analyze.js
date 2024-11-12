const { Configuration, OpenAIApi } = require('openai');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { text } = JSON.parse(event.body);

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "Analyze the following journal entry and return a JSON object with: moodScore (0-1), emotions (object with joy, sadness, anxiety, confidence, anger scores 0-1), and topicCount (number of distinct topics mentioned)."
      }, {
        role: "user",
        content: text
      }]
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: completion.data.choices[0].message.content
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to analyze text' })
    };
  }
};