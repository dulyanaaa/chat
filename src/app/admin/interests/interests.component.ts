import { Component, OnInit } from '@angular/core';
import { InterestService } from '../../services/interest.service';
import { ChannelService } from '../../services/channel.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-interests',
  imports: [CommonModule, FormsModule],
  templateUrl: './interests.component.html',
})
export class InterestsComponent implements OnInit {
  filteredInterests: any[] = []; // Array to store filtered interests

  constructor(
    private interestService: InterestService,
    private channelService: ChannelService,
    private userService: UserService,
    private router: Router
  ) {
    let user = this.userService.getCurrentUser();

    if (user) {
      if (
        !user.roles.includes('Super Admin') &&
        !user.roles.includes('Group Admin')
      ) {
        this.router.navigate(['/login']);
      }
    }
  }

  ngOnInit(): void {
    this.loadInterests();
  }

  // Load all interests (assuming you've set up some filtering logic)
  loadInterests(): void {
    this.interestService
      .getAllInterestsWithUsernameChannelName()
      .subscribe((interests) => {
        this.filteredInterests = interests;
      });
  }

  // Approve interest and add user to channel
  approveInterest(interest: any): void {
    const channel = this.channelService.getChannelById(interest.channelId);

    if (channel) {
      // Check if the user is already a member
      if (channel.members && !channel.members.includes(interest.userId)) {
        // Add the user to channel members array
        channel.members && channel.members.push(interest.userId);

        // Call the service to update channel members
        this.channelService
          .updateChannelMembers(channel.id, channel.members)
          .subscribe({
            next: () => {
              console.log(
                `User ${interest.userId} added to channel ${channel.id} successfully.`
              );
              // Remove interest after approval
              this.deleteInterest(interest.id);
            },
            error: (err) => {
              console.error('Failed to update channel members:', err);
            },
          });
      } else {
        console.log('User is already a member of this channel.');
      }
    } else {
      console.error('Channel not found.');
    }
  }

  // Delete the interest
  deleteInterest(interestId: number): void {
    this.interestService.removeInterest(interestId);
    // Optionally refresh the interests list after deleting
    this.loadInterests();
  }
}
