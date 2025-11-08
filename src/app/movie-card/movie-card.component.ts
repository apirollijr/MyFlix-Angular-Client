import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

@Component({
  selector: 'app-movie-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule
  ],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent implements OnInit, OnDestroy {
  movies: any[] = [];
  favoriteMovies: any[] = [];
  gridCols: number = 4;
  private resizeListener?: () => void;

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Debug authentication status
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      console.log('=== Authentication Status ===');
      console.log('Token present:', !!token);
      console.log('User present:', !!user);
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          console.log('Username:', parsedUser.Username);
        } catch (e) {
          console.log('Error parsing user:', e);
        }
      }
      console.log('==============================');
      
      this.getMovies();
      this.getFavoriteMovies();
      this.updateGridCols();
      
      // Create and store the resize listener
      this.resizeListener = () => this.updateGridCols();
      window.addEventListener('resize', this.resizeListener);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private updateGridCols(): void {
    this.gridCols = this.getGridCols();
  }

  /**
   * Gets all movies from the API
   */
  getMovies(): void {
    console.log('🎬 Fetching movies...');
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      console.log('✅ Movies loaded successfully:', resp.length, 'movies');
      this.movies = resp;
      
      // Debug: Check if all movies have valid _id properties
      console.log('🔍 MOVIE DATA VALIDATION:');
      this.movies.forEach((movie: any, index: number) => {
        if (!movie._id) {
          console.warn(`❌ Movie at index ${index} missing _id:`, movie.Title || 'Unknown Title');
        } else {
          console.log(`✅ Movie "${movie.Title}" has _id: ${movie._id}`);
        }
      });
      
      // Show first movie structure for reference
      if (this.movies.length > 0) {
        console.log('📋 Sample movie object structure:', {
          title: this.movies[0].Title,
          id: this.movies[0]._id,
          keys: Object.keys(this.movies[0])
        });
      }
      
      return this.movies;
    }, (error) => {
      console.error('❌ Failed to load movies:', error);
      this.snackBar.open('Failed to load movies. Please check your connection.', 'OK', {
        duration: 3000
      });
    });
  }

  /**
   * Gets user's favorite movies
   */
  getFavoriteMovies(): void {
    this.fetchApiData.getFavouriteMovies().subscribe((resp: any) => {
      this.favoriteMovies = resp || [];
      console.log('Favorite movie IDs:', this.favoriteMovies); // Debug log
    });
  }

  /**
   * Checks if a movie is in the user's favorites
   */
  isFavorite(movieId: string): boolean {
    // Debug logging for missing hearts
    if (!movieId) {
      console.warn('❌ isFavorite called with undefined/null movieId');
      return false;
    }
    
    const result = this.favoriteMovies.includes(movieId);
    
    // Debug: Log occasionally to see what's happening
    if (Math.random() < 0.1) { // Log ~10% of the time to avoid spam
      console.log('🔍 isFavorite check:', {
        movieId: movieId,
        movieIdType: typeof movieId,
        favoriteMovies: this.favoriteMovies,
        result: result
      });
    }
    
    return result;
  }

  /**
   * Adds a movie to favorites
   */
  addToFavorites(movieId: string): void {
    console.log('Adding movie to favorites:', movieId);
    
    // Check if user is logged in
    if (!isPlatformBrowser(this.platformId)) {
      console.log('Not in browser environment');
      return;
    }
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('Current user from localStorage:', user);
    console.log('Current token from localStorage:', token ? 'Present' : 'Missing');
    
    if (!token || !user) {
      this.snackBar.open('Please log in to add favorites', 'OK', {
        duration: 2000
      });
      this.router.navigate(['welcome']);
      return;
    }
    
    this.fetchApiData.addFavouriteMovie(movieId).subscribe((resp: any) => {
      console.log('Successfully added to favorites:', resp);
      this.snackBar.open('Movie added to favorites!', 'OK', {
        duration: 2000
      });
      this.favoriteMovies.push(movieId); // Update local array immediately
      this.getFavoriteMovies(); // Refresh favorites from server
    }, (error) => {
      console.error('Error adding to favorites:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      this.snackBar.open('Failed to add movie to favorites', 'OK', {
        duration: 2000
      });
    });
  }

  /**
   * Removes a movie from favorites
   */
  removeFromFavorites(movieId: string): void {
    this.fetchApiData.deleteFavouriteMovie(movieId).subscribe((resp: any) => {
      this.snackBar.open('Movie removed from favorites!', 'OK', {
        duration: 2000
      });
      // Update local array immediately
      this.favoriteMovies = this.favoriteMovies.filter(id => id !== movieId);
      this.getFavoriteMovies(); // Refresh favorites from server
    }, (error) => {
      console.error('Error removing from favorites:', error);
      this.snackBar.open('Failed to remove movie from favorites', 'OK', {
        duration: 2000
      });
    });
  }

  /**
   * Opens genre dialog
   */
  openGenreDialog(genre: any): void {
    this.dialog.open(GenreInfoComponent, {
      data: { genre: genre },
      width: '480px'
    });
  }

  /**
   * Opens director dialog
   */
  openDirectorDialog(director: any): void {
    this.dialog.open(DirectorInfoComponent, {
      data: { director: director },
      width: '480px'
    });
  }

  /**
   * Opens movie details dialog
   */
  openMovieDetailsDialog(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      data: { movie: movie },
      width: '480px',
      maxHeight: '80vh'
    });
  }

  /**
   * Gets number of columns based on screen size
   */
  getGridCols(): number {
    if (!isPlatformBrowser(this.platformId)) {
      return 4; // Default for SSR
    }
    if (window.innerWidth <= 640) return 1;  // Phone - single column
    if (window.innerWidth <= 1024) return 2; // Tablet - two columns
    return 4; // Desktop - four columns
  }

}
