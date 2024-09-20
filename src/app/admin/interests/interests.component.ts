import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InterestService } from '../../services/interest.service';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { ChannelService } from '../../services/channel.service';
import { Group } from '../../models/group.model';

@Component({
  selector: 'app-interests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interests.component.html',
  styleUrl: './interests.component.css',
})
export class InterestsComponent {
  allInterests: any[] = []; // This will store all interests
  filteredInterests: any[] = []; // This will store interests that match the criteria
  currentUserId: number; // Logged-in user's ID
  groupsAdmin: any[] = []; // Groups where the current user is an admin

  constructor(
    private interestService: InterestService,
    private groupService: GroupService,
    private userService: UserService,
    private ChannelService: ChannelService
  ) {
    this.currentUserId = this.userService.getCurrentUserId() || -1; // Get current logged-in user ID
    this.loadAdminGroups();
  }

  // Load groups where the current user is an admin
  loadAdminGroups(): void {
    this.groupService
      .getGroupsByAdminId(this.currentUserId)
      .subscribe((groups) => {
        this.groupsAdmin = groups;
        this.loadInterests();
      });
  }

  // Load all interests and filter them based on group channels and adminId
  loadInterests(): void {
    this.allInterests = this.interestService.getAllInterests(); // Fetch all interests

    this.filteredInterests = this.allInterests.filter((interest) => {
      // Check if interest's channelId exists in any of the admin's group channels
      return this.groupsAdmin.some(
        (group) =>
          group.channels.includes(interest.channelId) &&
          group.adminIds.includes(this.currentUserId)
      );
    });
  }

  approveInterest(interest: any): void {
    // Find the relevant group that the logged-in admin manages and includes the interest's channelId

    this.groupsAdmin.forEach((g) => {
      if (g.channels.include && g.channels.include(interest.channelId)) {
        const channel = g.channels.find(
          (channel: { id: number }) => channel.id === interest.channelId
        );

        // Check if the channel and group exist, and if the user is not already in the channel members
        if (channel && !channel.members.includes(interest.userId)) {
          // Add the user to the channel members array
          channel.members.push(interest.userId);

          // Call the ChannelService to update the channel members on the backend
          this.ChannelService.updateChannelMembers(channel.id, channel.members);
          this.deleteInterest(interest.id);
        } else {
          console.log('User is already a member of this channel.');
        }
      } else {
        console.log('not found');
      }
    });
  }

  deleteInterest(interestId: number): void {
    this.interestService.removeInterest(interestId);
  }
}
