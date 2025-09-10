import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT,
            clientSecret: process.env.GOOGLE_SECRET,
            // Use absolute URLs for both development and production
            callbackURL: process.env.NODE_ENV === 'production' 
                ? "https://calmspace-api.onrender.com/api/auth/google/callback"
                : "http://localhost:5000/api/auth/google/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile); 
        }
    )
);

export default passport;