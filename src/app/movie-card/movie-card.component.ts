import { Component, OnInit } from '@angular/core';
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
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getMovies();
    this.getFavoriteMovies();
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
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 900) return 2;
    if (window.innerWidth < 1200) return 3;
    return 4;
  }

}
