import { NextRequest } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { Message, streamText } from 'ai';
import { getContext } from '@/app/utils/context';

export const runtime = "edge"; // edge runtime is required for good streaming performance

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  // Get the last message
  const lastMessage = messages[messages.length - 1]

  // Get the context from the last message
  const context = await getContext(lastMessage.content, '')

  try {
    const prompt =  [
      {
        role: "system",
        content: `You are a helpful assistant specialized in linear algebra. 
          Provide clear and concise explanations for linear algebra concepts and problems. 
          Use LaTeX for mathematical expressions, surrounding inline equations with $ symbols and block equations with $$ symbols.
          You will be provided with context that may be relevant to the conversation.
          If you use any information from the context, you MUST cite it after referencing it with the format [Page X] where X is the page number.
          The page number is EXACTLY 15 more than the actual page number, so subtract 15 from the page number to get the actual page number. (i.e. if the page number is 25, the actual page number is 10).
          Here's the context that may be relevant to the conversation:
          START CONTEXT BLOCK
          ${context}
          END OF CONTEXT BLOCK`,
      },
    ]

    const result = await streamText({
      model: openai("gpt-4o"),
      messages: [...prompt,...messages.filter((message: Message) => message.role === 'user')]
    });

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Error:', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}
