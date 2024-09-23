import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ChannelService } from '../../services/channel.service';
import { ChatService } from '../../services/chat.service';
import { Channel } from '../../models/channel.model';
import { Chat } from '../../models/chat.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  channels: Channel[] = []; // List of channels where the user is a member
  filteredChannelList: Channel[] = [];
  selectedChannel: Channel | null = null; // Currently selected channel
  messages: Chat[] = []; // Array of messages for the selected channel
  newMessage: string = ''; // New message input
  currentUserId: number = -1; // ID of the current logged-in user
  searchQuery: string = '';

  @ViewChild('chatMessagesContainer') chatMessagesContainer!: ElementRef;

  constructor(
    private userService: UserService,
    private channelService: ChannelService,
    private chatService: ChatService // Injecting ChatService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.userService.getCurrentUserId(); // Get current user ID

    if (!isNaN(this.currentUserId)) {
      this.loadChannels();
    }
  }

  loadChannels(): void {
    // Fetch channels where the current user is a member
    this.channels = this.channelService.getChannels();
    // .filter(
    //   (channel) =>
    //     channel.members && channel.members.includes(this.currentUserId)
    // );

    this.filteredChannelList = this.channels; // Initially, show all channels

    if (this.channels.length > 0) {
      this.selectedChannel = this.channels[0]; // Automatically select the first channel
      this.loadMessages(); // Load messages for the selected channel
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
      this.scrollToBottom();
    }
  }
  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.chatMessagesContainer.nativeElement.scrollTop =
          this.chatMessagesContainer.nativeElement.scrollHeight;
      }, 100);
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedChannel) {
      let user = this.userService.getUserById(this.currentUserId);
      let username = '';
      if (user) {
        username = user.username;
      }
      const message: Chat = {
        messageId: 0, // Temporary, will be generated in the service
        userId: this.currentUserId!,
        username: username,
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

  filteredChannels(): Channel[] {
    return this.channels.filter((channel) =>
      channel.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
