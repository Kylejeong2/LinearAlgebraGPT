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
          Use PERFECT Latex for mathematical expressions.
          Do not write the Latex the same way that it is given in the Context, just write it the way you have been trained. 
          You will be provided with context that may be relevant to the conversation.
          If you use any information from the context, you MUST cite it after referencing it with the format [Page X] where X is the page number.
          SUPER SUPER IMPORTANT: The page number is EXACTLY 15 more than the actual page number, so subtract 15 from the page number to get the actual page number. (i.e. if the page number is 25, the actual page number is 10).
          Here's the context that may be relevant to the conversation:
          START CONTEXT BLOCK
          ${context}
          END OF CONTEXT BLOCK`,
      },
    ]

    // accidentally chunked it 15 pages off and too lazy to change all the embeddings and re-upsert

    const result = await streamText({
      model: openai("gpt-4o"),
      messages: [...prompt,...messages.filter((message: Message) => message.role === 'user')],
      maxTokens: 1000,
    });

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Error:', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}
