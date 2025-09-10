import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
    new GoogleStrategy(
        {
        clientID: process.env.GOOGLE_CLIENT,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "/api/auth/google/callback",
        },
        (accessToken, refreshToken, profile, done) => {
        return done(null, profile); 
        }
    )
);

export default passport;
