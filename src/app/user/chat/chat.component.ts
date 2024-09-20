import { Component } from '@angular/core';
import { Group } from '../../models/group.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { GroupService } from '../../services/group.service';
import { ChannelService } from '../../services/channel.service';
import { Channel } from '../../models/channel.model';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  groups: Group[] = []; // Array of groups
  selectedGroup: any; // Currently selected group
  selectedChannel: any; // Currently selected channel
  messages: any[] = []; // Array of messages
  newMessage: string = ''; // New message input
  currentUserId: any;
  channels: Channel[] = [];

  constructor(
    private userService: UserService,
    private GroupService: GroupService,
    private ChannelService: ChannelService
  ) {
    this.groups = this.GroupService.getGroups();
  }

  onGroupChange(event: any) {
    const groupId = event.target.value;
    const group = this.groups.find((g) => g.id == groupId);
    this.selectedGroup = group;
    this.channels = this.ChannelService.getChannels().filter((c) =>
      group?.channels.includes(c.id)
    );
    console.log(this.channels);
    this.selectedChannel = null; // Reset channel when group changes
    this.messages = []; // Reset messages
  }

  onChannelChange(event: any) {
    const channelId = event.target.value;
    this.selectedChannel = this.selectedGroup.channels.find(
      (channel: { id: any }) => channel.id === channelId
    );
    this.loadMessages(); // Load messages for the selected channel
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const message = {
        groupId: this.selectedGroup.id,
        channelId: this.selectedChannel.id,
        userId: this.currentUserId, // Assume you have the current user ID
        content: this.newMessage,
      };

      this.messages.push(message); // Add message to local messages
      this.newMessage = ''; // Clear input field

      // Here you can also save the message to your backend or a service
      // this.messageService.saveMessage(message);
    }
  }

  loadMessages() {
    // Load messages for the selected channel from your backend or service
    // this.messages = this.messageService.getMessages(this.selectedGroup.id, this.selectedChannel.id);
  }
}
