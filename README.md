# myFlix Angular Client

A responsive single-page application (SPA) built with Angular that provides users with access to information about different movies, directors, and genres. Users can sign up, update their personal information, and create a list of their favorite movies.

## Project Overview

This Angular client-side application interfaces with the [myFlix REST API](https://myflix-app-4c222f96b6ce.herokuapp.com/) to provide a complete movie database experience. The app is built using Angular 19 with TypeScript and follows modern Angular best practices.

## Features

### User Management

- **User Registration**: New users can sign up with username, password, email, and birthday
- **User Authentication**: Secure login/logout functionality with JWT token authentication
- **Profile Management**: Users can view and update their profile information
- **Account Deletion**: Users can delete their account

### Movie Database

- **Browse Movies**: View all available movies in the database
- **Movie Details**: Get detailed information about individual movies
- **Director Information**: Learn about movie directors and their filmography
- **Genre Information**: Explore different movie genres and their characteristics

### Favorites Management

- **Add to Favorites**: Users can add movies to their personal favorites list
- **Remove from Favorites**: Remove movies from the favorites list
- **View Favorites**: Display all favorited movies in one place

## Technical Stack

- **Framework**: Angular 19.2.0
- **Language**: TypeScript 5.7.2
- **HTTP Client**: Angular HttpClient with RxJS
- **Styling**: SCSS
- **State Management**: Local Storage for user session
- **Authentication**: JWT Token-based authentication

## API Integration

The application integrates with a REST API that provides the following endpoints:

### User Endpoints

- `POST /users` - User registration
- `POST /login` - User login
- `GET /users/{username}` - Get user details
- `PUT /users/{username}` - Update user information
- `DELETE /users/{username}` - Delete user account

### Movie Endpoints

- `GET /movies` - Get all movies
- `GET /movies/{title}` - Get specific movie details
- `GET /movies/director/{name}` - Get director information
- `GET /movies/genre/{name}` - Get genre information

### Favorites Endpoints

- `POST /users/{username}/movies/{movieId}` - Add movie to favorites
- `DELETE /users/{username}/movies/{movieId}` - Remove movie from favorites

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- Angular CLI (v19.2.19)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/myFlix-Angular-client.git
cd myFlix-Angular-client
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200/`

### Build for Production

To build the project for production:

```bash
ng build --prod
```

The build artifacts will be stored in the `dist/` directory.

### GitHub Pages Deployment

This project is configured for deployment to GitHub Pages using the `docs/` directory:

1. **Build for GitHub Pages**:

```bash
ng build --configuration production --base-href "/MyFlix-Angular-Client/"
```

2. **Copy build to docs directory**:

```bash
cp -r dist/myflix-angular-client/* docs/
```

3. **Commit and push**:

```bash
git add docs/
git commit -m "Deploy to GitHub Pages"
git push origin main
```

4. **Configure GitHub Pages**:
   - Go to your repository settings on GitHub
   - Navigate to Pages section
   - Set source to "Deploy from a branch"
   - Select "main" branch and "/docs" folder
   - Save settings

The `docs/` directory contains the production build of the application and serves as the source for GitHub Pages hosting. This allows the application to be publicly accessible at your GitHub Pages URL.

**Live Demo**: [View the deployed application](https://yourusername.github.io/MyFlix-Angular-Client/)

## Development

### Code Scaffolding

Generate a new component:

```bash
ng generate component component-name
```

Generate a new service:

```bash
ng generate service service-name
```

For more scaffolding options:

```bash
ng generate --help
```

### Running Tests

Execute unit tests:

```bash
ng test
```

### Project Structure

```
src/
├── app/
│   ├── fetch-api-data.service.ts    # API service for all HTTP requests
│   ├── app.component.*              # Root component
│   ├── app.config.ts                # Application configuration
│   └── app.routes.ts                # Application routing
├── index.html                       # Main HTML file
├── main.ts                         # Application bootstrap
└── styles.scss                     # Global styles

docs/                                # GitHub Pages deployment directory
├── index.csr.html                   # Production build entry point
├── main-*.js                        # Bundled application code
├── styles-*.css                     # Compiled styles
└── */                               # Route-specific assets

dist/                                # Local build output directory
```

## API Service

The `FetchApiDataService` handles all communication with the backend API. It includes:

- **Authentication Management**: Token-based authentication with automatic header injection
- **Error Handling**: Comprehensive error handling for all HTTP requests
- **Response Processing**: Data extraction and transformation
- **Local Storage Integration**: Automatic user session management

### Key Methods

- `userRegistration(userDetails)` - Register new user
- `userLogin(userDetails)` - Authenticate user
- `getAllMovies()` - Fetch all movies
- `getOneMovie(title)` - Get specific movie
- `getDirector(name)` - Get director information
- `getGenre(name)` - Get genre information
- `addFavouriteMovie(movieId)` - Add to favorites
- `deleteFavouriteMovie(movieId)` - Remove from favorites
- `editUser(userData)` - Update user profile
- `deleteUser()` - Delete user account

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is part of the CareerFoundry Full-Stack Web Development Program.

## Contact

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## Acknowledgments

- Built as part of the CareerFoundry Full-Stack Web Development Program
- Uses the myFlix REST API backend
- Angular framework and community for excellent documentation and tools
