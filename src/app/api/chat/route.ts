import { NextRequest } from 'next/server';
import { OpenAI } from 'openai';
import { StreamingTextResponse, OpenAIStream } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages } = body;

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant specialized in linear algebra. Provide clear and concise explanations for linear algebra concepts and problems. Use LaTeX for mathematical expressions, surrounding inline equations with $ symbols and block equations with $$ symbols." },
        ...messages.slice(-3)
      ],
      max_tokens: 500,
      temperature: 0.7,
      stream: true,
    });

    // Use OpenAIStream to properly handle the streaming response
    const openAIStream = OpenAIStream(stream);
    
    // Return a StreamingTextResponse, which sets the appropriate headers
    return new StreamingTextResponse(openAIStream);
  } catch (error) {
    console.error('Error:', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}
