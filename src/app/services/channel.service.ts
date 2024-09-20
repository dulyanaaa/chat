import { Injectable } from '@angular/core';
import { Channel } from '../models/channel.model';
import { localStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  updateChannelMembers(id: any, members: any) {
    let channel = this.getChannelById(id);
    if (channel) {
      channel.members = members;
      this.updateChannel(channel);
    }
  }
  private storageKey = 'channels';

  constructor(private localStorageService: localStorageService) {
    // Initialize channels if not already present in localStorage
    if (!this.localStorageService.getItem(this.storageKey)) {
      this.localStorageService.setItem(this.storageKey, []);
    }
  }

  // Method to get all channels from localStorage
  getChannels(): Channel[] {
    return this.localStorageService.getItem(this.storageKey) || [];
  }

  getChannelsCount(): number {
    return this.localStorageService.getItem(this.storageKey).length || 0;
  }

  getChannelById(id: number): Channel | undefined {
    const channels = this.getChannels();
    return channels.find((channel: Channel) => channel.id === id);
  }

  // Method to get channels by group ID from localStorage
  getChannelsByGroupId(groupId: number): Channel[] {
    const channels = this.getChannels();
    return channels.filter((channel: Channel) => channel.groupId === groupId);
  }

  // Method to delete a channel by its ID from localStorage
  deleteChannel(channelId: number): void {
    let channels = this.getChannels();
    channels = channels.filter((channel: Channel) => channel.id !== channelId);
    this.localStorageService.setItem(this.storageKey, channels);
  }

  // Method to update a channel in localStorage
  // updateChannel(channelId: number, updatedChannel: Partial<Channel>): void {
  //   const channels = this.getChannels();
  //   const channelIndex = channels.findIndex(
  //     (channel: Channel) => channel.id === channelId
  //   );

  //   if (channelIndex !== -1) {
  //     channels[channelIndex] = { ...channels[channelIndex], ...updatedChannel };
  //     this.localStorageService.setItem(this.storageKey, channels);
  //   }
  // }

  // Method to add a new channel to localStorage
  addChannel(newChannel: Channel): void {
    const channels = this.getChannels();
    channels.push(newChannel);
    this.localStorageService.setItem(this.storageKey, channels);
  }

  getChannelsByGroup(groupId: number): Channel[] {
    const channels = this.getChannels();
    return channels.filter((channel) => channel.groupId === groupId);
  }

  // Update a channel in local storage
  updateChannel(updatedChannel: Channel): void {
    let channels = this.getChannels();
    const index = channels.findIndex(
      (channel) => channel.id === updatedChannel.id
    );

    if (index !== -1) {
      channels[index] = updatedChannel; // Update the channel
      this.localStorageService.setItem(this.storageKey, channels); // Save back to local storage
    }
  }
}
