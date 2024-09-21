import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ChannelService } from '../../services/channel.service';
import { ChatService } from '../../services/chat.service';
import { Channel } from '../../models/channel.model';
import { Chat } from '../../models/chat.model';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  channels: Channel[] = []; // List of channels where the user is a member
  selectedChannel: Channel | null = null; // Currently selected channel
  messages: Chat[] = []; // Array of messages for the selected channel
  newMessage: string = ''; // New message input
  currentUserId: number = -1; // ID of the current logged-in user

  constructor(
    private userService: UserService,
    private channelService: ChannelService,
    private chatService: ChatService, // Injecting ChatService
    private groupService: GroupService // Injecting ChatService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.userService.getCurrentUserId(); // Get current user ID
    if (this.currentUserId) {
      this.loadChannels();
    }
  }

  loadChannels(): void {
    const allChannels = this.channelService.getChannels();

    const adminUserId = this.userService.getCurrentUserId();

    this.channels = allChannels.filter((channel) => {
      const isMember = channel.members && channel.members.includes(adminUserId);

      const isGroupAdmin =
        channel.groupId && this.isAdminInGroup(channel.groupId, adminUserId);

      return isMember || isGroupAdmin;
    });

    if (this.channels.length > 0) {
      this.selectedChannel = this.channels[0];
      this.loadMessages();
    }
  }

  private isAdminInGroup(groupId: number, userId: number): boolean {
    const found_group = this.groupService
      .getGroups()
      .find((g) => g.id == groupId);
    if (found_group) {
      return found_group.adminIds.includes(userId);
    } else {
      return false;
    }
  }

  selectChannel(channel: Channel): void {
    this.selectedChannel = channel;
    this.loadMessages(); // Load messages whenever a new channel is selected
  }

  loadMessages(): void {
    if (this.selectedChannel) {
      this.messages = this.chatService.getChatsByChannelId(
        this.selectedChannel.id
      ); // Load messages from the service
      console.log(`Loaded messages for channel ${this.selectedChannel.name}`);
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedChannel) {
      const message: Chat = {
        messageId: 0, // Temporary, will be generated in the service
        userId: this.currentUserId!,
        timestamp: new Date(),
        channelId: this.selectedChannel.id,
        content: this.newMessage,
      };

      // Use the chat service to add the new message
      this.chatService.addChat(message).subscribe((response) => {
        if (response.success) {
          this.loadMessages(); // Reload messages after sending
          this.newMessage = ''; // Clear input field
        } else {
          console.error('Failed to send message');
        }
      });
    }
  }
}
