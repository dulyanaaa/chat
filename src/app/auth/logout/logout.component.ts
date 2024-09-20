import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { localStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent {
  constructor(
    private localStorageService: localStorageService,
    private router: Router
  ) {
    this.logout();
  }

  logout(): void {
    // Remove currentUser from local storage
    this.localStorageService.removeItem('currentUser');

    // Navigate to the login page
    this.router.navigate(['/login']);
  }
}
