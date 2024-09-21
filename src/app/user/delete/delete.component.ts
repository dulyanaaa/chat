import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [],
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css'],
})
export class DeleteComponent {
  constructor(private userService: UserService, private router: Router) {
    this.confirmDelete();
  }

  confirmDelete(): void {
    if (
      confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      const currentUserId = this.userService.getCurrentUserId();
      if (currentUserId) {
        this.userService.deleteUser(currentUserId);
        // this.userService.logout();
        this.router.navigate(['/logout']);
      }
    }
  }
}
