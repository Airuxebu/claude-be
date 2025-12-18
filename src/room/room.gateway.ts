import { OnEvent } from '@nestjs/event-emitter';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessageService } from 'src/chat-message/chat-message.service';
import { GenaiService } from 'src/genai/genai.service';
import { TranslationService } from 'src/translation/translation.service';

type UserSession = { userId: string; preferredLanguage: string };

@WebSocketGateway(80, {})
export class RoomGateway {
  private users = new Map<string, UserSession>();
  private roomLanguages = new Map<string, Set<string>>();

  constructor(
    private readonly messageService: ChatMessageService,
    private readonly translationService: TranslationService,
    private readonly genai: GenaiService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  handleJoin(
    @MessageBody()
    {
      roomId,
      userId,
      preferredLanguage,
    }: { roomId: string; userId: string; preferredLanguage: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId);

    const langRoom = `${roomId}:${preferredLanguage}`;
    client.join(langRoom);
    console.log(`Client ${userId} joined language room ${langRoom}`);

    if (!this.roomLanguages.has(roomId)) {
      this.roomLanguages.set(roomId, new Set());
    }
    this.roomLanguages.get(roomId)?.add(preferredLanguage);

    this.users.set(client.id, { userId, preferredLanguage });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    {
      roomId,
      content,
      senderId,
    }: {
      roomId: string;
      content: string;
      senderId: string;
    },
  ) {
    await this.messageService.createMessage({
      content,
      roomId,
      senderId,
    });

    const roomSockets = await this.server.in(roomId).fetchSockets();

    for (const socket of roomSockets) {
      const user = this.users.get(socket.id);
      if (!user) continue;

      const translatedText = await this.translationService.translateText(
        content,
        user.preferredLanguage,
      );

      this.server.to(socket.id).emit('newMessage', {
        original: content,
        translated: translatedText,
        language: user.preferredLanguage,
        senderId,
        createdAt: new Date(),
      });
    }
  }

  @SubscribeMessage('voice:start')
  handleStart(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    {
      userId,
      preferredLanguage,
    }: { roomId: string; userId: string; preferredLanguage: string },
  ) {
    this.users.set(client.id, { userId, preferredLanguage });
  }

  @SubscribeMessage('voice:stream')
  async handleStream(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; audio: Buffer },
  ) {
    const user = this.users.get(client.id);
    if (!user || !data.audio) return;

    const roomId = data.roomId;
    const sourceLang = user.preferredLanguage;
    const base64 = data.audio.toString('base64');

    // 1. PASS-THROUGH: Send raw audio to users with the SAME language
    // client.to(...) broadcasts to everyone in that room EXCEPT the sender
    const sameLangRoom = `${roomId}:${sourceLang}`;
    client.to(sameLangRoom).emit('voice:audio', {
      audio: base64,
      language: sourceLang,
      type: 'original', // Frontend can use this to show "Original Audio" vs "AI"
      senderId: user.userId,
      createdAt: new Date(),
    });

    // 2. TRANSLATION: Send to AI for DIFFERENT languages only
    const allLangs = this.roomLanguages.get(roomId) || new Set();

    // Filter: Remove the speaker's language from the AI targets
    const targetLangs = Array.from(allLangs).filter(
      (lang) => lang !== sourceLang,
    );

    if (targetLangs.length > 0) {
      // We broadcast to the specific languages needed
      await this.genai.broadcastAudio(roomId, base64, user.userId, targetLangs);
    }
  }

  @SubscribeMessage('voice:stop')
  handleStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; language: string },
  ) {
    this.genai.stopSession(data.roomId, data.language);
  }

  @OnEvent('genai.voice')
  handleVoice({
    audio,
    roomId,
    language,
    senderId,
  }: {
    audio: string;
    roomId: string;
    language: string;
    senderId: string;
  }) {
    // Broadcast ONLY to the specific language group in that room
    const targetRoom = `${roomId}:${language}`;

    console.log(`Sending audio chunk to room ${targetRoom}`);

    this.server.to(targetRoom).emit('voice:audio', {
      audio: audio,
      language: language,
      type: 'translated',
      senderId,
      createdAt: new Date(),
    });
  }
}
