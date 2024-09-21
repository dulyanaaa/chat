import { Injectable } from '@angular/core';
import { Chat } from '../models/chat.model';
import { localStorageService } from './local-storage.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private chats: Chat[] = [];
  private storageKey = 'chats';

  constructor(private localStorageService: localStorageService) {
    if (!this.localStorageService.getItem(this.storageKey)) {
      this.localStorageService.setItem(this.storageKey, []);
    }
  }

  getChats(): Chat[] {
    return this.localStorageService.getItem(this.storageKey) || [];
  }

  getChatsByChannelId(channelId: number): Chat[] {
    const chats = this.getChats();
    return chats.filter((chat) => chat.channelId === channelId);
  }

  getChatsByUserId(userId: number): Chat[] {
    const chats = this.getChats();
    return chats.filter((chat) => chat.userId === userId);
  }

  addChat(newChat: Chat): Observable<any> {
    const chats = this.getChats();
    newChat.messageId = this.generateMessageId(chats);
    chats.push(newChat);
    this.localStorageService.setItem(this.storageKey, chats);
    return of({ success: true });
  }

  deleteChat(messageId: number): Observable<any> {
    let chats = this.getChats();
    const chatExists = chats.some((chat) => chat.messageId === messageId);
    if (chatExists) {
      chats = chats.filter((chat) => chat.messageId !== messageId);
      this.localStorageService.setItem(this.storageKey, chats);
      return of({ success: true });
    } else {
      return of({ success: false, message: 'Chat not found' });
    }
  }

  updateChat(updatedChat: Chat): Observable<any> {
    let chats = this.getChats();
    const index = chats.findIndex(
      (chat) => chat.messageId === updatedChat.messageId
    );

    if (index !== -1) {
      chats[index] = updatedChat;
      this.localStorageService.setItem(this.storageKey, chats);
      return of({ success: true });
    } else {
      return of({ success: false, message: 'Chat not found' });
    }
  }

  private generateMessageId(chats: Chat[]): number {
    if (chats.length === 0) {
      return 1;
    }
    return Math.max(...chats.map((chat) => chat.messageId)) + 1;
  }
}
