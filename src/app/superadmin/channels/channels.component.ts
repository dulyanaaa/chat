import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Group } from '../../models/group.model';
import { Channel } from '../../models/channel.model';
import { GroupService } from '../../services/group.service';
import { ChannelService } from '../../services/channel.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-channels',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './channels.component.html',
  styleUrl: './channels.component.css',
})
export class ChannelsComponent {
  groups: Group[] = [];
  channels: Channel[] = [];
  selectedGroupId: number | null = null;
  selectedGroupChannels: Channel[] = [];
  selectedGroup: Group | null = null;
  filteredChannels: Channel[] = [];

  /* EDITING CHANNEL */
  editingChannel: Channel | null = null; // Track the channel being edited
  editingChannelName: string = ''; // Track the new name
  errorMessage: string = '';

  constructor(
    private groupService: GroupService,
    private ChannelService: ChannelService,
    private UserService: UserService,
    private router: Router
  ) {
    let user = this.UserService.getCurrentUser();

    if (user) {
      if (!user.roles.includes('Super Admin')) {
        this.router.navigate(['/login']);
      }
    }
  }

  ngOnInit() {
    this.groups = this.groupService.getGroups();
    this.channels = this.ChannelService.getChannels();
  }

  // When a group is selected
  onGroupSelect() {
    this.editingChannel = null;
    this.selectedGroup =
      this.groups.find((group) => group.id == this.selectedGroupId) || null;
    if (this.selectedGroup) {
      // Filter channels that belong to the selected group
      this.selectedGroupChannels = this.channels.filter((channel) =>
        this.selectedGroup?.channels.includes(channel.id)
      );
    } else {
      this.selectedGroupChannels = [];
    }
  }

  // Edit channel
  editChannel(channel: Channel) {
    this.editingChannel = { ...channel };
    this.editingChannelName = channel.name;
    this.errorMessage = '';
  }

  updateChannel(): void {
    if (!this.editingChannelName.trim()) {
      this.errorMessage = 'Channel name cannot be empty.';
      return;
    }

    // Check if the channel name already exists in the selected group
    const isDuplicate = this.selectedGroupChannels.some(
      (ch) =>
        ch.name.toLowerCase() === this.editingChannelName.toLowerCase() &&
        ch.id !== this.editingChannel?.id
    );

    if (isDuplicate) {
      this.errorMessage = 'Channel name already exists in this group.';
      return;
    }

    // Update the channel name in the channel service
    if (this.editingChannel) {
      this.editingChannel.name = this.editingChannelName;
      this.ChannelService.updateChannel(this.editingChannel);

      // Refresh the selected group channels
      if (this.selectedGroup) {
        this.selectedGroupChannels = this.ChannelService.getChannelsByGroup(
          this.selectedGroup.id
        );
      }

      // Reset the editing state
      this.editingChannel = null;
      this.editingChannelName = '';
    }
  }

  // Delete channel
  deleteChannel(channel: Channel) {
    if (this.selectedGroup) {
      this.selectedGroup.channels = this.selectedGroup.channels.filter(
        (chId) => chId !== channel.id
      );

      // Update the groups list after removing the channel from the group
      this.groupService.updateGroups(this.groups);
    }
    // Implement logic to delete the channel
    this.selectedGroupChannels = this.selectedGroupChannels.filter(
      (ch) => ch.id !== channel.id
    );
    this.ChannelService.deleteChannel(channel.id);
    this.channels = this.ChannelService.getChannels();
  }
}
