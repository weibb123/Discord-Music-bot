const { ApplicationCommandOptionType } = require('discord.js');
const OpenAI = require('openai');
const { Translate } = require('../../process_tools');

const client = new OpenAI({
    apiKey: process.env.GLHF_API_KEY,
    baseURL: "https://glhf.chat/api/openai/v1"
});

module.exports = {
    name: 'ask',
    description: 'Ask AI a question',
    voiceChannel: false,

    async execute({ inter }) {
        const userMention = `<@${inter.member.id}>`;
        const question = inter.options.getString('question');

        try {
            const completion = await client.chat.completions.create({
                messages: [
                    { role: 'system', content: 'You are a helpful assistant. Your role is to answer users question truthfully. At most 100 words.' },
                    { role: 'user', content: question }
                ],
                model: "hf:deepseek-ai/DeepSeek-V3",
                max_tokens: 500
            });

            return inter.editReply({
                content: await Translate(`${userMention}, 你问了: "${question}"\n 我的回答: ${completion.choices[0].message.content}`)
            });
        } catch (error) {
            return inter.editReply({
                content: await Translate(`${userMention}, 对不起，我现在回答不了 <❌> (${error.message})`)
            });
        }
    },

    options: [
        {
            name: 'question',
            description: 'Your question for this AI',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ]
};