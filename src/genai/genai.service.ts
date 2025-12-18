import {
  GoogleGenAI,
  LiveServerMessage,
  Modality,
  Session,
} from '@google/genai';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class GenaiService {
  private ai: GoogleGenAI;
  private sessions = new Map<string, { session: Session }>();

  constructor(private eventEmitter: EventEmitter2) {
    this.ai = new GoogleGenAI({
      vertexai: true,
      project: process.env.GOOGLE_PROJECT_ID,
      location: process.env.GOOGLE_CLOUD_LOCATION,
    });
  }

  async broadcastAudio(
    roomId: string,
    audio: string,
    senderId: string,
    targetLanguages: string[],
  ) {
    for (const lang of targetLanguages) {
      const sessionKey = `${roomId}:${lang}`;
      let sessionData = this.sessions.get(sessionKey);

      // If session doesn't exist or is closed, start a new one
      if (!sessionData) {
        await this.startSession(roomId, lang, senderId);
        sessionData = this.sessions.get(sessionKey);
      }

      if (sessionData?.session) {
        try {
          sessionData.session.sendRealtimeInput({
            audio: {
              data: audio,
              mimeType: 'audio/pcm;rate=16000',
            },
          });
        } catch (error) {
          console.log(`Failed to send audio to ${lang} session`, error);
          this.stopSession(roomId, lang); // Cleanup dead session
        }
      }
    }
  }

  async startSession(
    roomId: string,
    language: string,
    senderId: string,
    model = 'gemini-live-2.5-flash',
  ) {
    const sessionKey = `${roomId}:${language}`;
    console.log(`Starting AI session for session ${sessionKey}`);

    const session = await this.ai.live.connect({
      model,
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: `You are a simultaneous interpreter. Whatever you hear, translate it immediately into ${language}. Do not respond to questions, just translate. If the audio is already in ${language}, repeat it clearly.`,
      },

      callbacks: {
        onopen: () => console.log(`[AI] Session opened at ${sessionKey}`),

        onmessage: (msg: LiveServerMessage) => {
          const audio =
            msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (!audio) return;

          // Emit event with room and language context
          this.eventEmitter.emit('genai.voice', {
            audio,
            roomId,
            language,
            senderId,
          });
        },

        onerror: (err) =>
          console.error(`[AI] Session error for session ${sessionKey}`, err),

        onclose: (e: any) => {
          console.log(
            `[AI] Session closed for session ${sessionKey}. ` +
              `Type: **${e.type}**, ` +
              `Code: **${e.code}**, ` +
              `Clean: **${e.wasClean}**`,
          );
          // Log the reason separately to prevent truncation due to line length limits
          console.log(`[AI] Close Reason Detail: **${e.reason}**`);
          this.sessions.delete(sessionKey);
        },
      },
    });

    this.sessions.set(sessionKey, { session });
  }

  sendAudio(clientId: string, base64: string) {
    const session = this.sessions.get(clientId);
    if (!session?.session) throw new BadRequestException('No session found');

    session.session.sendRealtimeInput({
      audio: {
        data: base64,
        mimeType: 'audio/pcm;rate=16000',
      },
    });
  }

  stopSession(roomId: string, language: string) {
    const key = `${roomId}:${language}`;
    const sessionData = this.sessions.get(key);
    if (sessionData) {
      sessionData.session.close();
      this.sessions.delete(key);
    }
  }
}
