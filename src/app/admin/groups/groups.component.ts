import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Group } from '../../models/group.model';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { ChannelService } from '../../services/channel.service';
import { User } from '../../models/user.model';
import { Channel } from '../../models/channel.model';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css',
})
export class GroupsComponent {
  groupsCount: number = 0;
  loggedinAdminId;
  groups: Group[] = [];
  showAddGroupForm = false;
  newGroup: Group = {
    id: 0,
    name: '',
    channels: [],
    adminIds: [],
    members: [],
  };
  successMessage: string = '';
  errorMessage: string = '';
  groupsLength: number = 0;

  showAddMembersForm: { [key: number]: boolean } = {};
  selectedUserId: { [key: number]: number | null } = {};

  /* REMOVE MEMBERS OF GROUP */
  selectedGroup: Group = {
    id: 0,
    name: '',
    channels: [],
    adminIds: [],
    members: [],
  };
  membersToRemove: { [key: string]: boolean } = {};

  /* ADD CHANNELS TO GROUP */
  newChannelName: string = '';

  /* ADD CHANNELS TO GROUP START */
  getChannelName(channelId: number): string {
    const channel = this.channelService
      .getChannels()
      .find((ch) => ch.id === channelId);
    return channel ? channel.name : 'Unknown';
  }

  openAddChannelModal(group: Group): void {
    this.selectedGroup = group;
    this.newChannelName = '';
    const modal = new bootstrap.Modal(
      document.getElementById('addChannelModal')!
    );
    modal.show();
  }

  addChannelToGroup(): void {
    let newChanneId: number = this.channelService.getChannelsCount();
    if (!this.newChannelName || !this.selectedGroup) return;

    const channelExists = this.selectedGroup.channels.some((channelId) => {
      const existingChannel = this.channelService.getChannelById(channelId);
      return (
        existingChannel &&
        existingChannel.name.toLowerCase() === this.newChannelName.toLowerCase()
      );
    });

    if (channelExists) {
      alert('A channel with the same name already exists in this group.');
      return;
    }

    const newChannel: Channel = {
      id: ++newChanneId,
      name: this.newChannelName,
      groupId: this.selectedGroup.id,
      members: [],
    };

    this.channelService.addChannel(newChannel);

    if (!this.selectedGroup.channels.includes(newChanneId))
      this.selectedGroup.channels.push(newChanneId);

    this.groupService.updateGroups(this.groups);

    const modalElement = document.getElementById('addChannelModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.hide();
    }
  }
  /* ADD CHANNELS TO GROUP END */

  constructor(
    private groupService: GroupService,
    private userService: UserService,
    private channelService: ChannelService
  ) {
    this.loadGroups();
    this.loggedinAdminId = this.userService.getCurrentUserId() || -1; // Adjust based on how you get the current user ID
    this.groups = this.groups.filter((group) =>
      group.adminIds.includes(this.loggedinAdminId)
    );
    this.groupsLength = this.groups.length;
    this.groupsCount = this.groupService.grouptCount();
  }

  /* REMOVE MEMBERS TO GROUP - START */
  openRemoveMembersModal(group: Group) {
    this.selectedGroup = group;
    // this.selectedGroup.adminIds = selectedGroup.adminIds.filter(
    //   (id) => false
    //   // (id) => id !== this.loggedinAdminId
    // );
    this.membersToRemove = {}; // Reset the removal list
    group.members = group.members.filter(
      (m) => parseInt(m) != this.loggedinAdminId
    );
    group.members.forEach((member) => {
      this.membersToRemove[member] = false; // Initialize all checkboxes as unchecked
    });

    // Open the modal (Bootstrap 5 method)
    const removeMembersModal = new bootstrap.Modal(
      document.getElementById('removeMembersModal')!
    );
    removeMembersModal.show();
  }

  // Remove the selected members
  removeSelectedMembers() {
    if (this.selectedGroup) {
      this.selectedGroup.members = this.selectedGroup.members.filter(
        (member) => !this.membersToRemove[member] // Remove only unchecked members
      );
      this.groupService.updateGroups(this.groups);

      // Reset the selected group and members list
      this.selectedGroup = {
        id: 0,
        name: '',
        channels: [],
        adminIds: [],
        members: [],
      };
      this.membersToRemove = {};

      // Hide the modal

      const modalElement = document.getElementById('removeMembersModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.hide();
      }
    }
  }

  // Helper function to get username by member ID
  getUsername(memberId: string): string {
    const user = this.userService
      .getUsers()
      .find((user) => user.id === +memberId);
    return user ? user.username : 'Unknown';
  }
  /* REMOVE MEMBERS TO GROUP - END */

  /* ADD MEMBERS TO GROUP START */
  availableUsers(currentMembers: string[]): User[] {
    const allUsers = this.userService.getUsers();
    return allUsers.filter(
      (user) =>
        !user.roles.includes('Super Admin') &&
        !currentMembers.includes(user.username) &&
        user.id !== this.loggedinAdminId
    );
  }

  addMemberToGroup(groupId: number, userId: number | null) {
    if (userId) {
      const group = this.groups.find((g) => g.id === groupId);
      if (group && !group.members.includes(userId.toString())) {
        group.members.push(userId.toString());
        this.groupService.updateGroups(this.groups);
        const user = this.userService.getUsers().find((u) => u.id == userId);

        if (user) {
          // Check if the groupId is already in the user's groups array
          if (!user.groups.includes(groupId)) {
            user.groups.push(groupId); // Add the group ID to user's groups
          }

          // Update the user in userService
          this.userService.updateUser(user);
        }
        this.successMessage = 'Member added successfully!';
        this.selectedUserId[groupId] = null;
      }
    }
  }

  toggleAddMembersForm(groupId: number) {
    this.showAddMembersForm[groupId] = !this.showAddMembersForm[groupId];
  }
  /* ADD MEMBERS TO GROUP END */

  private loadGroups() {
    this.groups = this.groupService.getGroups();
  }

  toggleAddGroupForm() {
    this.showAddGroupForm = !this.showAddGroupForm;
  }

  addGroup() {
    this.errorMessage = '';
    this.newGroup.id = ++this.groupsCount;
    this.newGroup.adminIds = [this.loggedinAdminId];
    /* CHECK IF GROUP WITH SAME NAME ALREADY EXIST OR NOT */
    const existingGroup = this.groups.find(
      (group) => group.name.toLowerCase() === this.newGroup.name.toLowerCase()
    );

    if (existingGroup) {
      // Show an error message and stop the group creation
      this.errorMessage = `Group with name "${this.newGroup.name}" already exists!`;
      return;
    }
    this.groupService.addGroup(this.newGroup);
    this.successMessage = `Group "${this.newGroup.name}" added successfully!`;

    this.newGroup = {
      id: 0,
      name: '',
      channels: [],
      adminIds: [],
      members: [],
    };
    this.showAddGroupForm = false;

    this.loadGroups();
  }

  deleteGroup(group: Group) {
    this.groupService.deleteGroup(group.id);
    this.successMessage = `Group "${group.name}" deleted successfully!`;
    this.loadGroups();
  }
}
