import dotenv from 'dotenv';
import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from "passport-github2";
import User from '../models/user.model.js';

dotenv.config();

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/users/auth/google/callback",
  },
  async(accessToken, refreshToken, profile, done) => {
    try{
      const email = profile.emails[0].value;
      let user = await User.findOne({ email });

      if(!user){
          user = await User.create({
            email,
            username: profile.id,
            firstname: profile.name?.givenName || "",
            lastname: profile.name?.familyName || "",
            password: profile.id + "@oauth",
            isVerified: true,
            profilePicture: profile.photos[0].value,
          });
      }
      return done(null, user);
    }catch (err) {
        return done(err, null)
    }
  })
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/users/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            email,
            username: profile.username,
            firstname: profile.displayName?.split(" ")[0] || "",
            lastname: profile.displayName?.split(" ")[1] || "",
            password: profile.id + "@oauth",
            isVerified: true,
            profilePicture: profile.photos[0].value,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});