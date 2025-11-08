import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {

  user: any = {};
  favoriteMovies: any[] = [];

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getUser();
    }
  }

  /**
   * Gets user information
   */
  getUser(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      this.userData.Username = this.user.Username;
      this.userData.Email = this.user.Email;
      this.userData.Birthday = this.user.Birthday;
      this.fetchApiData.getAllMovies().subscribe((movies: any) => {
        this.favoriteMovies = movies.filter((m: any) => this.user.FavoriteMovies.indexOf(m._id) >= 0);
      });
    });
  }

  /**
   * Removes a movie from favorites
   */
  removeFromFavorites(movieId: string): void {
    console.log('Removing movie from favorites:', movieId);
    this.fetchApiData.deleteFavouriteMovie(movieId).subscribe((resp: any) => {
      console.log('Successfully removed from favorites:', resp);
      this.snackBar.open('Movie removed from favorites!', 'OK', {
        duration: 2000
      });
      // Update the favorites list
      this.favoriteMovies = this.favoriteMovies.filter(movie => movie._id !== movieId);
      // Update the user object
      this.user.FavoriteMovies = this.user.FavoriteMovies.filter((id: string) => id !== movieId);
    }, (error) => {
      console.error('Error removing from favorites:', error);
      this.snackBar.open('Failed to remove movie from favorites', 'OK', {
        duration: 2000
      });
    });
  }

  /**
   * Updates user information
   */
  editUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((result) => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('user', JSON.stringify(result));
      }
      this.snackBar.open('User updated successfully!', 'OK', {
        duration: 2000
      });
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    });
  }

  /**
   * Deletes user account
   */
  deleteUser(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.fetchApiData.deleteUser().subscribe((result) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.clear();
        }
        this.router.navigate(['welcome']);
        this.snackBar.open('Account deleted successfully', 'OK', {
          duration: 2000
        });
      }, (result) => {
        this.snackBar.open(result, 'OK', {
          duration: 2000
        });
      });
    }
  }

}
