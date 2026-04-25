const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

/* =========================
   GOOGLE STRATEGY
========================= */
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID?.trim(),
        clientSecret: process.env.GOOGLE_CLIENT_SECRET?.trim(),
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(
              new Error("Google account did not provide an email"),
              null,
            );
          }

          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email: email.toLowerCase() }],
          });

          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email: email.toLowerCase(),
              googleId: profile.id,
              provider: "google",
              role: "seeker",
            });
          } else if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      },
    ),
  );
}

/* =========================
   GITHUB STRATEGY
========================= */
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID?.trim(),
        clientSecret: process.env.GITHUB_CLIENT_SECRET?.trim(),
        callbackURL:
          process.env.NODE_ENV === "production"
            ? "https://job-portal-backend-3m4k.onrender.com/api/auth/github/callback"
            : "http://localhost:5000/api/auth/github/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("GITHUB PROFILE:", profile);

          const email =
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value
              : null;

          const lookup = [{ githubId: profile.id }];
          if (email) lookup.push({ email: email.toLowerCase() });

          let user = await User.findOne({ $or: lookup });

          if (!user) {
            const userData = {
              name: profile.username || profile.displayName,
              githubId: profile.id,
              provider: "github",
              role: "seeker",
            };
            if (email) userData.email = email.toLowerCase();

            user = await User.create(userData);
          } else if (!user.githubId) {
            user.githubId = profile.id;
            await user.save();
          }

          return done(null, user);
        } catch (err) {
          console.error("GitHub Error:", err);
          return done(err, null);
        }
      },
    ),
  );
}

/* =========================
   SERIALIZE / DESERIALIZE
========================= */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
