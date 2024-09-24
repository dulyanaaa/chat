import { Component } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css',
})
export class ConfigComponent {
  constructor(
    private userService: UserService,
    private router: Router,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    let usersLength = this.userService.getUsers.length;
    const existingUsers = this.userService.getUsers();
    const existingGroups = this.groupService.getGroups();
    let groupsLength = existingGroups.length;
    const superAdmin = existingUsers.find((user) =>
      user.roles.includes('Super Admin')
    );

    let superUser = existingUsers.find((u) => u.username == 'super');
    if (!superUser) {
      this.userService.addUser(
        new User(
          ++usersLength,
          'super',
          'super@example.com',
          '123',
          ['Super Admin'],
          []
        )
      );
    }

    let firstGroup = existingGroups.find((g) => g.name == 'first');
    if (!firstGroup) {
      this.groupService.addGroup({
        id: ++groupsLength,
        name: 'first',
        channels: [],
        adminIds: [],
        members: [],
      });
    }

    let secondGroup = existingGroups.find((g) => g.name == 'second');
    if (!secondGroup) {
      this.groupService.addGroup({
        id: ++groupsLength,
        name: 'second',
        channels: [],
        adminIds: [],
        members: [],
      });
    }

    let thirdGroup = existingGroups.find((g) => g.name == 'third');
    if (!thirdGroup) {
      this.groupService.addGroup({
        id: ++groupsLength,
        name: 'third',
        channels: [],
        adminIds: [],
        members: [],
      });
    }

    let fourthGroup = existingGroups.find((g) => g.name == 'fourth');
    if (!fourthGroup) {
      this.groupService.addGroup({
        id: ++groupsLength,
        name: 'fourth',
        channels: [],
        adminIds: [],
        members: [],
      });
    }

    let fifthGroup = existingGroups.find((g) => g.name == 'fifth');
    if (!fifthGroup) {
      this.groupService.addGroup({
        id: ++groupsLength,
        name: 'fifth',
        channels: [],
        adminIds: [],
        members: [],
      });
    }

    let aliUser = existingUsers.find((u) => u.username == 'ali');
    if (!aliUser) {
      this.userService.addUser(
        new User(++usersLength, 'ali', 'ali@example.com', '123', ['User'], [])
      );
    }

    let noumanUser = existingUsers.find((u) => u.username == 'nouman');
    if (!noumanUser) {
      this.userService.addUser(
        new User(
          ++usersLength,
          'nouman',
          'nouman@example.com',
          '123',
          ['User'],
          []
        )
      );
    }

    let qasimUser = existingUsers.find((u) => u.username == 'qasim');
    if (!qasimUser) {
      this.userService.addUser(
        new User(
          ++usersLength,
          'qasim',
          'qasim@example.com',
          '123',
          ['User'],
          []
        )
      );
    }

    let basitUser = existingUsers.find((u) => u.username == 'basit');
    if (!basitUser) {
      this.userService.addUser(
        new User(
          ++usersLength,
          'basit',
          'basit@example.com',
          '123',
          ['User'],
          []
        )
      );
    }

    let bilalUser = existingUsers.find((u) => u.username == 'bilal');
    if (!bilalUser) {
      this.userService.addUser(
        new User(
          ++usersLength,
          'bilal',
          'bilal@example.com',
          '123',
          ['User'],
          []
        )
      );
    }

    this.router.navigate(['/login'], {
      state: {
        message: 'Configured successfully!',
      },
    });
  }
}
