import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {
    let user = this.userService.getCurrentUser();

    if (user) {
      if (user.roles.includes('Super Admin')) {
        this.router.navigate(['/superadmin']);
      } else if (user.roles.includes('Group Admin')) {
        this.router.navigate(['/groupadmin']);
      } else {
        this.router.navigate(['/user']);
      }
    }
  }

  onSubmit(): void {
    const user: User | null = this.userService.authenticate(
      this.username,
      this.password
    );

    if (!user) {
      this.errorMessage = 'Invalid username or password';
    } else {
      this.userService.setCurrentUser(user);

      if (user.roles.includes('Super Admin')) {
        this.router.navigate(['/superadmin']);
      } else if (user.roles.includes('Group Admin')) {
        this.router.navigate(['/groupadmin']);
      } else {
        this.router.navigate(['/user']);
      }
    }
  }
}
