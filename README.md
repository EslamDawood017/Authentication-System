# AuthSystem

This repository contains a full-stack authentication system with a .NET 8 backend and an Angular frontend.

## Project Structure

- `BACK_END/`
  - .NET 8 Web API project (`LOGIN_APP`) implementing authentication, user registration, password reset, email OTP verification, and refresh tokens.
  - `Controllers/` contains API controllers such as `AuthController` and `PostsController`.
  - `Data/` includes the Entity Framework database context.
  - `DTOs/` contains request and response models used by the API.
  - `Models/` holds application models like `ApplicationUser`, `RefreshToken`, `UserOtp`, and email settings.
  - `Repositories/` implements user and OTP data access logic.
  - `Services/` contains authentication and email delivery services.

- `FRONT_END/`
  - Angular application for user login, registration, password reset, OTP verification, and protected pages.
  - `src/app/auth/` contains authentication-related components.
  - `src/app/Core/` includes guards, interceptors, models, and services for authentication flow.
  - `src/environments/` contains environment settings for API endpoints.

## Prerequisites

- .NET 8 SDK
- Node.js 18+ and npm
- Angular CLI (optional but recommended)
- An SMTP email provider configured in the backend settings for OTP / reset email delivery

## Backend Setup

1. Open a terminal in `BACK_END/LOGIN_APP`.
2. Restore dependencies:
   ```bash
   dotnet restore
   ```
3. Update connection strings and email settings in `appsettings.json` and `appsettings.Development.json` as needed.
4. Apply migrations if database setup is required:
   ```bash
   dotnet ef database update
   ```
5. Run the backend API:
   ```bash
   dotnet run --project LOGIN_APP.csproj
   ```

## Frontend Setup

1. Open a terminal in `FRONT_END/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update API endpoint configuration in `src/environments/environment.ts` and `src/environments/environment.prod.ts` if necessary.
4. Run the Angular app:
   ```bash
   npm start
   ```

## Available Functionality

- User registration
- Login with JWT and refresh token support
- Forgot password flow with OTP verification
- Reset password
- Protected dashboard/pages via route guards
- Email notification support through SMTP

## Notes

- Ensure CORS is configured correctly in the backend if the Angular app and API are served from different origins.
- Use development API and frontend URLs consistently across environment files.
- If you modify the data model, regenerate EF migrations and update the database.

## Directory Quick Links

- Backend solution: `BACK_END/LOGIN_APP.sln`
- Frontend entrypoint: `FRONT_END/src/main.ts`
- Angular configuration: `FRONT_END/angular.json`

---

Created for the AuthSystem project with backend authentication services and a frontend Angular client.
