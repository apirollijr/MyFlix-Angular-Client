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
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      return this.movies;
    });
  }

  /**
   * Gets user's favorite movies
   */
  getFavoriteMovies(): void {
    this.fetchApiData.getFavouriteMovies().subscribe((resp: any) => {
      this.favoriteMovies = resp;
    });
  }

  /**
   * Checks if a movie is in the user's favorites
   */
  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.includes(movieId);
  }

  /**
   * Adds a movie to favorites
   */
  addToFavorites(movieId: string): void {
    this.fetchApiData.addFavouriteMovie(movieId).subscribe((resp: any) => {
      this.snackBar.open('Movie added to favorites!', 'OK', {
        duration: 2000
      });
      this.getFavoriteMovies(); // Refresh favorites
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
      this.getFavoriteMovies(); // Refresh favorites
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
    if (window.innerWidth <= 640) return 1;  // Phone - single column
    if (window.innerWidth <= 1024) return 2; // Tablet - two columns
    return 4; // Desktop - four columns
  }

}
