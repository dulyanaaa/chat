import { Injectable } from '@angular/core';
import { Channel } from '../models/channel.model';
import { localStorageService } from './local-storage.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  private channels: Channel[] = [];
  updateChannelMembers(channelId: number, members: any): Observable<any> {
    this.channels = this.getChannels();
    const channel = this.getChannelById(channelId); // Find the channel by ID

    if (channel) {
      channel.members = members; // Update the members array
      let found_channel = this.channels.find((c) => c.id == channel.id) || {
        id: -1,
        name: '',
        groupId: -1,
        members: [],
      };
      found_channel.members = members;
      this.saveChannels(); // Save the updated channels list to storage
      return of({ success: true }); // Return observable with success
    } else {
      return of({ success: false, message: 'Channel not found' }); // Handle case where channel isn't found
    }
  }
  private saveChannels(): void {
    localStorage.setItem('channels', JSON.stringify(this.channels));
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

  getChannelById(id: any): Channel {
    const channels = this.getChannels();
    return (
      channels.find((channel: Channel) => channel.id == id) || {
        id: -1,
        name: '',
        groupId: -1,
        members: [],
      }
    );
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
