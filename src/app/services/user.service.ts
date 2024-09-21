// services/user.service.ts
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { localStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [];

  constructor(private localStorageService: localStorageService) {
    this.users = this.localStorageService.getItem('users') || [];
  }

  getUsers(): User[] {
    return this.users;
  }

  getUserById(userId: number) {
    return this.users.find((u) => u.id == userId);
  }

  addUser(user: User): void {
    this.users.push(user);
    this.localStorageService.setItem('users', this.users);
  }

  authenticate(username: string, password: string): User | null {
    return (
      this.users.find(
        (user) => user.username === username && user.password === password
      ) || null
    );
  }

  getCurrentUser(): User | null {
    const loggedInUser = this.localStorageService.getItem('currentUser');
    return loggedInUser ? loggedInUser : null;
  }

  setCurrentUser(user: User): void {
    this.localStorageService.setItem('currentUser', user);
  }

  updateUser(updatedUser: User): void {
    const index = this.users.findIndex((user) => user.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      this.localStorageService.setItem('users', this.users);
    }
  }

  deleteUser(userId: number): void {
    this.users = this.users.filter((user) => user.id !== userId);
    this.localStorageService.setItem('users', this.users);
  }

  getAllUsersExceptSuperAdmins(): User[] {
    return this.users.filter((user) => !user.roles.includes('Super Admin'));
  }

  getCurrentUserId(): number {
    const currentUser = this.getCurrentUser();
    return currentUser ? currentUser.id : -1;
  }

  removeGroupFromUser(userId: number, groupId: number): void {
    const user = this.getUserById(userId);
    if (user) {
      user.groups = user.groups.filter((id) => id !== groupId);
      this.updateUser(user);
    }
  }
}
