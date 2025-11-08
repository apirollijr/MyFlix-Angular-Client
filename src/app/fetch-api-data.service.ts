import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Declaring the api url that will provide data for the client app
const apiUrl = 'https://apirolli-movieapi-7215bc5accc0.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  /**
   * Safe localStorage access
   */
  private getFromStorage(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }

  /**
   * Making the api call for the user registration endpoint
   * @param userDetails - Object containing user registration details
   * @returns Observable for the API response
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Making the api call for the user login endpoint
   * @param userDetails - Object containing username and password
   * @returns Observable for the API response
   */
  public userLogin(userDetails: any): Observable<any> {
    console.log('API Service - Login attempt:', userDetails);
    console.log('API URL:', apiUrl + 'login');
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Making the api call for the get all movies endpoint
   * @returns Observable for the API response
   */
  public getAllMovies(): Observable<any> {
    const token = this.getFromStorage('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Making the api call for the get one movie endpoint
   * @param title - Movie title
   * @returns Observable for the API response
   */
  public getOneMovie(title: string): Observable<any> {
    const token = this.getFromStorage('token');
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Making the api call for the get director endpoint
   * @param directorName - Director's name
   * @returns Observable for the API response
   */
  public getDirector(directorName: string): Observable<any> {
    const token = this.getFromStorage('token');
    return this.http.get(apiUrl + 'movies/director/' + directorName, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Making the api call for the get genre endpoint
   * @param genreName - Genre name
   * @returns Observable for the API response
   */
  public getGenre(genreName: string): Observable<any> {
    const token = this.getFromStorage('token');
    return this.http.get(apiUrl + 'movies/genre/' + genreName, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Making the api call for the get user endpoint
   * @returns Observable for the API response
   */
  public getUser(): Observable<any> {
    const user = JSON.parse(this.getFromStorage('user') || '{}');
    const token = this.getFromStorage('token');
    return this.http.get(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Making the api call for the get favourite movies for a user endpoint
   * @returns Observable for the API response
   */
  public getFavouriteMovies(): Observable<any> {
    const user = JSON.parse(this.getFromStorage('user') || '{}');
    const token = this.getFromStorage('token');
    return this.http.get(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      map((data) => data.FavoriteMovies),
      catchError(this.handleError)
    );
  }

  /**
   * Making the api call for the add to favorite movies endpoint
   * @param movieId - The ID of the movie to add to favorites
   * @returns Observable for the API response
   */
  public addFavouriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(this.getFromStorage('user') || '{}');
    const token = this.getFromStorage('token');
    
    const url = apiUrl + 'users/' + user.Username + '/favorites/' + movieId;
    
    console.log('=== ADD FAVORITE API CALL (API Doc Compliant) ===');
    console.log('Expected API format: POST /users/:username/favorites/:movieID');
    console.log('Constructed URL:', url);
    console.log('API Base URL:', apiUrl);
    console.log('Username from storage:', user.Username);
    console.log('Movie ID to add:', movieId);
    console.log('Movie ID type:', typeof movieId);
    console.log('Movie ID length:', movieId?.length);
    console.log('Token exists:', !!token);
    console.log('Token length:', token?.length);
    console.log('User object keys:', Object.keys(user || {}));
    console.log('Full user object:', user);
    
    // Validate required data before making request
    if (!user.Username) {
      console.error('❌ ERROR: No username found in storage!');
      return throwError(() => new Error('No username found in local storage'));
    }
    
    if (!token) {
      console.error('❌ ERROR: No token found in storage!');
      return throwError(() => new Error('No authentication token found'));
    }
    
    if (!movieId) {
      console.error('❌ ERROR: No movie ID provided!');
      return throwError(() => new Error('Movie ID is required'));
    }
    
    console.log('✅ All required data present, making API call...');
    console.log('================================================');
    
    return this.http.post(url, {}, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      })
    }).pipe(
      map((response) => {
        console.log('✅ Success response:', response);
        return this.extractResponseData(response);
      }),
      catchError((error) => {
        console.error('❌ API Error details:');
        console.error('Status:', error.status);
        console.error('Status Text:', error.statusText);
        console.error('Error URL:', error.url);
        console.error('Error body:', error.error);
        console.error('Response headers:', error.headers);
        
        // Additional debugging for 404 errors
        if (error.status === 404) {
          console.error('🔍 404 DEBUGGING:');
          console.error('- Check if username exists in database:', user.Username);
          console.error('- Check if movie ID format is correct:', movieId);
          console.error('- Verify API base URL is correct:', apiUrl);
          console.error('- Expected endpoint: POST /users/' + user.Username + '/favorites/' + movieId);
        }
        
        return this.handleError(error);
      })
    );
  }

  /**
   * Making the api call for the edit user endpoint
   * @param updatedUser - Object containing updated user details
   * @returns Observable for the API response
   */
  public editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(this.getFromStorage('user') || '{}');
    const token = this.getFromStorage('token');
    return this.http.put(apiUrl + 'users/' + user.Username, updatedUser, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Making the api call for the delete user endpoint
   * @returns Observable for the API response
   */
  public deleteUser(): Observable<any> {
    const user = JSON.parse(this.getFromStorage('user') || '{}');
    const token = this.getFromStorage('token');
    return this.http.delete(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Making the api call for the delete a movie from the favorite movies endpoint
   * @param movieId - Movie ID to remove from favorites
   * @returns Observable for the API response
   */
  public deleteFavouriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(this.getFromStorage('user') || '{}');
    const token = this.getFromStorage('token');
    return this.http.delete(apiUrl + 'users/' + user.Username + '/favorites/' + movieId, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  // Error handling
  private handleError(error: HttpErrorResponse): any {
    console.error('=== HTTP ERROR DETAILS ===');
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error('Server-side error:');
      console.error('Status Code:', error.status);
      console.error('Status Text:', error.statusText);
      console.error('Error Body:', error.error);
      console.error('URL:', error.url);
      console.error('Headers:', error.headers);
    }
    console.error('==========================');
    return throwError(() => error);
  }
}
