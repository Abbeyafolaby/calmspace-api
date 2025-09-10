# CalmSpace

A mental wellness app designed to help students and young professionals manage stress and anxiety through daily check-ins and self-care tools.

## Description

CalmSpace is an app designed to help students and young professionals manage stress and anxiety through quick daily check-ins and simple self-care tools. The app offers short calming routines, mood tracking, and motivational content to support mental well-being in a fast-paced world.

### Features

- **Daily Check-ins**: Quick stress and mood assessments
- **Calming Routines**: Short, guided self-care activities
- **Mood Tracking**: Monitor your emotional well-being over time
- **Motivational Content**: Inspiring messages and tips for mental wellness
- **User-Friendly Interface**: Simple, intuitive design for busy lifestyles

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT-based authentication system
- **API Testing**: Postman collection included


## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd calmspace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   npm run dev
   ```

5. **Server will run on**
   ```
   http://localhost:5000
   ```

## Usage

### API Authentication Flow

1. **Register** - Create a new account
2. **Verify Account** - Verify email with OTP
3. **Complete Profile** - Add nickname and finalize setup
4. **Login** - Access your account

### API Base URL
```
http://localhost:5000/api
```

## API Endpoints

- `POST /auth/signup` - User registration
- `POST /auth/verify-otp` - Account verification
- `POST /auth/complete-profile` - Profile completion
- `POST /auth/login` - User login

## Authentication Flow

The API uses a multi-step authentication process:

### 1. Register
**POST** `/auth/signup`

Create a new user account.

**Request Body:**
```json
{
    "fullname": "Your Full Name",
    "email": "your.email@example.com",
    "password": "YourPassword123"
}
```

### 2. Verify Account
**POST** `/auth/verify-otp`

Verify your account using the OTP sent to your email.

**Request Body:**
```json
{
    "email": "your.email@example.com",
    "otp": "123456"
}
```

### 3. Complete Profile
**POST** `/auth/complete-profile`

Complete your profile setup by adding a nickname.

**Request Body:**
```json
{
    "email": "your.email@example.com",
    "nickname": "YourNickname"
}
```

### 4. Login
**POST** `/auth/login`

Login to your account.

**Request Body:**
```json
{
    "email": "your.email@example.com",
    "password": "YourPassword123"
}
```

## License

This project is licensed under the MIT License 
