// services/group.service.ts
import { Injectable } from '@angular/core';
import { Group } from '../models/group.model';
import { localStorageService } from './local-storage.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  grouptCount(): number {
    return this.getGroups().length;
  }
  private groups: Group[] = [];

  constructor(private localStorageService: localStorageService) {
    this.groups = this.localStorageService.getItem('groups') || [];
  }

  getGroups(): Group[] {
    return this.groups;
  }

  addGroup(group: Group): void {
    this.groups.push(group);
    this.localStorageService.setItem('groups', this.groups);
  }

  updateGroups(groups: Group[]): void {
    localStorage.setItem('groups', JSON.stringify(groups));
  }

  addMembersToGroup(selectedGroupId: number, selectedUsers: number[]) {
    const group = this.groups.find((group) => group.id === selectedGroupId);
    console.log(group);
  }

  deleteGroup(id: number): void {
    this.groups = this.groups.filter((group) => group.id !== id);
    this.localStorageService.setItem('groups', this.groups);
  }

  getGroupsByAdminId(adminId: number): Observable<any[]> {
    const adminGroups = this.groups.filter((group) =>
      group.adminIds.includes(adminId)
    );
    return of(adminGroups);
  }
}
