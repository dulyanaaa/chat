import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service'; // Adjust the path as needed
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });

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

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill out all fields correctly.';
      return;
    }

    const { username, email, password, confirmPassword } =
      this.registerForm.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    let usersLength = this.userService.getUsers().length;
    this.userService.addUser(
      new User(++usersLength, username, email, password, ['User'], [])
    );
    this.router.navigate(['/login']);

    // .subscribe(
    //   () => {
    //     this.router.navigate(['/login']);
    //   },
    //   error => {
    //     this.errorMessage = 'Registration failed. Please try again.';
    //   }
    // );
  }
}
