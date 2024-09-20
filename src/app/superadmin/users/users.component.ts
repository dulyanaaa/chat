import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Group } from '../../models/group.model';
import { GroupService } from '../../services/group.service';
import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  users: User[] = [];
  usersLength: number = 0;
  showAddUserForm = false;
  newUser: User = {
    id: 0,
    username: '',
    email: '',
    password: '',
    roles: [],
    groups: [],
  };
  confirmPassword = '';
  successMessage = '';

  /* ADMIN GROUP */
  availableGroups: Group[] = [];
  showGroupsList = false;
  selectedGroups: number[] = [];
  selectedUserId: number | null = null;

  /* USER BEING REMOVED FROM GROUP ADMIN */
  selectedGroupsForRemove: number[] = [];
  selectedUser: User = {
    id: 1234,
    username: '',
    password: '',
    roles: [],
    email: '',
    groups: [],
  };

  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private router: Router
  ) {
    let user = this.userService.getCurrentUser();

    if (user) {
      if (!user.roles.includes('Super Admin')) {
        this.router.navigate(['/login']);
      }
    }
  }

  ngOnInit(): void {
    this.loadUsers();

    this.availableGroups = this.groupService.getGroups();
  }

  /* REMOVE USER FROM GROUP ADMIN ROLE FOR GROUPS START */
  showRemoveAdminModal(user: User) {
    this.selectedUser = user;
    this.selectedGroupsForRemove = this.groupService
      .getGroups()
      .filter((group) => group.adminIds.includes(user.id))
      .map((group) => group.id);
    const modalElement = document.getElementById('removeAdminModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  closeRemoveAdminModal() {
    // this.selectedUser = {
    //   id: 1234,
    //   username: '',
    //   password: '',
    //   roles: [],
    //   email: '',
    //   groups: [],
    // };
    // this.selectedGroupsForRemove = [];
    const modalElement = document.getElementById('removeAdminModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.hide();
    }
  }

  // Handle checkbox changes for removing admin
  onRemoveAdminSelectionChange(event: any, groupId: number) {
    if (!event.target.checked) {
      if (!this.selectedGroupsForRemove.includes(groupId)) {
        this.selectedGroupsForRemove.push(groupId);
      }
    } else {
      this.selectedGroupsForRemove = this.selectedGroupsForRemove.filter(
        (id) => id !== groupId
      );
    }
  }

  // Method to update groups and remove the user from adminIds
  updateRemoveAdmin() {
    if (this.selectedUser === null) return;

    this.selectedGroupsForRemove.forEach((groupId) => {
      const group = this.groupService.getGroups().find((g) => g.id === groupId);
      if (group) {
        group.adminIds = group.adminIds.filter(
          (id) => id !== this.selectedUser!.id
        );

        const isStillAdmin = this.groupService
          .getGroups()
          .some((g) => g.adminIds.includes(this.selectedUser!.id));

        if (!isStillAdmin) {
          this.selectedUser!.roles = this.selectedUser!.roles.filter(
            (role) => role !== 'Group Admin'
          );
          this.userService.updateUser(this.selectedUser!);
        }

        this.groupService.updateGroups(this.groupService.getGroups());
        this.loadUsers();
      }
    });

    this.closeRemoveAdminModal();
  }
  /* REMOVE USER FROM GROUP ADMIN ROLE FOR GROUPS END */

  /* MAKE GROUP ADMIN START */
  toggleGroupsList() {
    this.showGroupsList = !this.showGroupsList;
  }
  promoteToAdmin(user: User) {
    this.selectedUserId = user.id;
    this.availableGroups = this.groupService
      .getGroups()
      .filter((group) => !group.adminIds.includes(user.id));
    this.showGroupsList = true;
    const modalElement = document.getElementById('groupListModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  addUserToGroups() {
    this.selectedGroups.forEach((groupId) => {
      const group = this.groupService.getGroups().find((g) => g.id === groupId);
      const user = this.users.find((u) => u.id === this.selectedUserId); // Assuming you have selectedUserId

      if (group && user) {
        if (!group.adminIds.includes(user.id)) {
          /* MAKE USER GROUP ADMIN */
          group.adminIds.push(user.id);

          if (!group.members.includes(user.id.toString())) {
            /* MAKE USER MEMBER OF GROUP */
            group.members.push(user.id.toString());
          }

          if (!user.groups.includes(groupId)) {
            /* ADD GROUP TO USER GROUPS ARRAY */
            user.groups.push(groupId);
          }

          if (!user.roles.includes('Group Admin')) {
            /* ADD ADMIN ROLE TO USER ROLES */
            user.roles.push('Group Admin');
          }
          this.userService.updateUser(user);
        }
      }
    });

    this.groupService.updateGroups(this.groupService.getGroups());

    this.successMessage = 'User promoted to Admin successfully!';
    this.showGroupsList = false;
    this.selectedGroups = [];
  }
  onGroupSelectionChange(event: any, groupId: number) {
    if (event.target.checked) {
      this.selectedGroups.push(groupId);
    } else {
      this.selectedGroups = this.selectedGroups.filter((id) => id !== groupId);
    }
  }
  closegroupListModal() {
    const modalElement = document.getElementById('groupListModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.hide();
    }
  }
  /* MAKE GROUP ADMIN STOP */

  /* MAKE SUPER REMOVE SUPER START */
  makeSuper(user: User) {
    if (!user.roles.includes('Super Admin')) {
      user.roles.push('Super Admin');
      this.userService.updateUser(user);
      this.loadUsers();
      this.successMessage = `${user.username} is now a Super Admin.`;
    }
  }

  // Remove Super Admin role
  removeSuper(user: User) {
    const index = user.roles.indexOf('Super Admin');
    if (index !== -1) {
      user.roles.splice(index, 1);
      this.userService.updateUser(user);
      this.loadUsers();
      this.successMessage = `${user.username} is no longer a Super Admin.`;
    }
  }
  /* MAKE SUPER REMOVE SUPER END */

  /* ADD USER START */
  toggleAddUserForm() {
    this.showAddUserForm = !this.showAddUserForm;
  }

  addUser() {
    const existingUser = this.users.find(
      (user) => user.username === this.newUser.username
    );
    if (existingUser) {
      alert('Username already exists. Please choose a different username.');
      return;
    }

    if (this.newUser.password !== this.confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }

    this.newUser.id = ++this.usersLength;
    this.userService.addUser(this.newUser);
    this.loadUsers();
    this.successMessage = 'User added successfully!';

    this.newUser = {
      id: 0,
      username: '',
      email: '',
      password: '',
      roles: [],
      groups: [],
    };
    this.confirmPassword = '';

    this.showAddUserForm = false;
  }
  /* ADD USER END */

  loadUsers(): void {
    const currentUser = this.userService.getCurrentUser();
    this.usersLength = this.userService.getUsers().length;
    this.users = this.userService
      .getUsers()
      .filter((user) => user.id !== currentUser?.id);
  }

  deleteUser(user: User): void {
    this.userService.deleteUser(user.id);
    this.loadUsers();
  }
}
