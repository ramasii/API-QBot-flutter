const { Configuration, OpenAIApi } = require("openai");

async function prosesOpenAI(inputUser){
    const configuration = new Configuration({
        apiKey: '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'
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-0301",
        messages: [{role:"user", content:inputUser}]
    });
    console.log(response.data.choices[0].message.content);
    return response.data.choices[0].message.content
}

module.exports = {prosesOpenAI}