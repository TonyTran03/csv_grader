// pages/api/generate.js
import { ChatOpenAI } from "@langchain/openai";

const chatModel = new ChatOpenAI({
    apiKey: process.env.OPEN_API_KEY
});

export default async function handler(req, res) {
    const { content } = req.body;

    const prompt = `Analyze the following CSV data and provide an assessment of its data quality and overall health, including a percentage score out of 100% ending with "Overall health score: without the percentage sign":\n\n${content}`;


    try {
        const response = await chatModel.invoke(prompt);
        res.status(200).json({ success: true, data: response });
    } catch (error) {
        console.error("Error invoking chat model:", error);
        res.status(500).json({ success: false, error: 'Failed to generate response' });
    }
}
