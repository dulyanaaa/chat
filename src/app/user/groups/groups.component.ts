import { Component } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { Group } from '../../models/group.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Channel } from '../../models/channel.model';
import { ChannelService } from '../../services/channel.service';
import { InterestService } from '../../services/interest.service';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css',
})
export class GroupsComponent {
  userGroups: Group[] = [];
  currentUserId: number = 0;
  selectedGroup: Group | null = null;
  groupChannels: Channel[] = [];

  constructor(
    private groupService: GroupService,
    private userService: UserService,
    public channelService: ChannelService,
    public interestService: InterestService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.userService.getCurrentUserId() || -1;
    this.loadUserGroups();
  }

  loadUserGroups(): void {
    const allGroups = this.groupService.getGroups();
    this.userGroups = allGroups.filter((group) =>
      group.members.includes(String(this.currentUserId))
    );
  }

  viewGroupChannels(group: Group): void {
    this.selectedGroup = group;
    let selectedGroupChannels = this.selectedGroup.channels;
    let allChannels = this.channelService.getChannels();
    const filteredCollections = allChannels.filter((channel) =>
      selectedGroupChannels.includes(channel.id)
    );
    this.groupChannels = filteredCollections;
  }

  isInterested(channelId: number): boolean {
    const interests = this.interestService.getInterestsByUserId(
      this.currentUserId
    );
    return interests.some((interest) => interest.channelId === channelId);
  }

  // Mark the current user as interested in a particular channel
  markInterested(channelId: number): void {
    this.interestService.addInterest(this.currentUserId, channelId);
  }

  leaveGroup(group: Group): void {
    group.members = group.members.filter(
      (memberId) => Number(memberId) !== this.currentUserId
    );
    let all_groups = this.groupService.getGroups();
    let found_group = all_groups.find((g) => g.id == group.id);
    if (found_group) {
      found_group.members = group.members;
      this.groupService.updateGroups(all_groups);
    }

    this.userGroups = this.userGroups.filter(
      (userGroup) => userGroup.id !== group.id
    );

    this.userService.removeGroupFromUser(this.currentUserId, group.id);
  }
}
