import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { localStorageService } from './local-storage.service';
import { UserService } from './user.service';
import { Interest } from '../models/interest.model';
import { Observable, of } from 'rxjs';
import { ChannelService } from './channel.service';

@Injectable({
  providedIn: 'root',
})
export class InterestService {
  private interests: Interest[] = []; // Array to store interests

  constructor(
    private localStorageService: localStorageService,
    private UserService: UserService,
    private channelService: ChannelService
  ) {
    this.loadInterests();
  }

  // Add interest for a user
  addInterest(userId: number, channelId: number): void {
    const newInterest: Interest = {
      id: this.interests.length + 1, // Generate a new ID
      userId,
      channelId,
    };

    this.interests.push(newInterest);
    this.saveInterests(); // Save updated interests to localStorage
  }

  // Get interests by userId
  getInterestsByUserId(userId: number): Interest[] {
    return this.interests.filter((interest) => interest.userId === userId);
  }

  // Get all interests
  getAllInterests(): Interest[] {
    return this.interests;
  }

  getAllInterestsWithUsernameChannelName(): Observable<any[]> {
    const enrichedInterests = this.interests.map((interest) => {
      const user = this.UserService.getUserById(interest.userId);
      const channel = this.channelService.getChannelById(interest.channelId);
      return {
        ...interest,
        userName: user ? user.username : 'Unknown User',
        channelName: channel ? channel.name : 'Unknown Channel',
      };
    });
    return of(enrichedInterests); // Return enriched interests with user and channel names
  }

  // Remove interest by interestId
  removeInterest(interestId: number): void {
    this.interests = this.interests.filter(
      (interest) => interest.id !== interestId
    );
    this.saveInterests(); // Save updated interests to localStorage
  }

  // Load interests from localStorage
  private loadInterests(): void {
    const savedInterests = this.localStorageService.getItem('interests');
    if (savedInterests) {
      this.interests = savedInterests;
    }
  }

  // Save interests to localStorage
  private saveInterests(): void {
    this.localStorageService.setItem('interests', this.interests);
  }
}
