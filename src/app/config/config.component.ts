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
    const usersLength = this.userService.getUsers.length;
    const existingUsers = this.userService.getUsers();
    const superAdmin = existingUsers.find((user) =>
      user.roles.includes('Super Admin')
    );

    this.groupService.addGroup({
      id: 1,
      name: 'first',
      channels: [],
      adminIds: [],
      members: [],
    });
    this.groupService.addGroup({
      id: 2,
      name: 'second',
      channels: [],
      adminIds: [],
      members: [],
    });
    this.groupService.addGroup({
      id: 3,
      name: 'third',
      channels: [],
      adminIds: [],
      members: [],
    });
    this.groupService.addGroup({
      id: 4,
      name: 'fourth',
      channels: [],
      adminIds: [],
      members: [],
    });
    this.groupService.addGroup({
      id: 5,
      name: 'fifth',
      channels: [],
      adminIds: [],
      members: [],
    });
    this.userService.addUser(
      new User(1, 'ali', 'ali@example.com', '123', [], [])
    );
    this.userService.addUser(
      new User(2, 'nouman', 'nouman@example.com', '123', [], [])
    );
    this.userService.addUser(
      new User(3, 'kamran', 'kamran@example.com', '123', [], [])
    );
    this.userService.addUser(
      new User(4, 'bilal', 'bilal@example.com', '123', [], [])
    );
    this.userService.addUser(
      new User(5, 'yaseen', 'yaseen@example.com', '123', [], [])
    );

    if (!superAdmin) {
      const superAdminUser: User = new User(
        usersLength,
        'super',
        'super@example.com',
        '123',
        ['Super Admin'],
        []
      );

      this.userService.addUser(superAdminUser);

      this.router.navigate(['/login']);
    }
  }
}
