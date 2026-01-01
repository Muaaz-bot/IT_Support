import { GoogleGenAI, Modality, Type, FunctionDeclaration } from "@google/genai";

// Ensure we use the API key directly from the environment variable as per guidelines
export const createAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const itHelpdeskTools: FunctionDeclaration[] = [
  {
    name: 'resetPassword',
    description: 'Resets a user password for their enterprise account.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        username: { type: Type.STRING, description: 'The employee username or email' },
      },
      required: ['username'],
    }
  },
  {
    name: 'createTicket',
    description: 'Creates a new IT support ticket in the system.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Brief summary of the issue' },
        description: { type: Type.STRING, description: 'Detailed explanation' },
        priority: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
        category: { type: Type.STRING, description: 'E.g., Hardware, Software, Network, Access' }
      },
      required: ['title', 'description', 'priority']
    }
  },
  {
    name: 'checkServerStatus',
    description: 'Checks the health of a specific internal server.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        serverId: { type: Type.STRING, description: 'The ID of the server (e.g. SRV-01, DB-PRD)' }
      },
      required: ['serverId']
    }
  }
];

export const SYSTEM_PROMPT = `
You are TMC IT SUPPORT, a high-level IT Support AI Agent.
CRITICAL FOR VOICE: Be extremely punchy. Keep responses under 15 words if possible. 
Don't use filler words like "Sure," or "I can help with that." Just give the answer or ask the next question.
Your goal is to assist employees with technical issues, troubleshoot problems, and manage support tickets.
When users report issues, ask ONE clarifying question.
Provide instructions in tiny, atomic steps.
`;

// Helper for manual base64 decoding to Uint8Array as required for raw PCM audio processing
export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Manual audio decoding for raw PCM streams (do not use AudioContext.decodeAudioData for streams)
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Helper for manual base64 encoding from Uint8Array
export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}