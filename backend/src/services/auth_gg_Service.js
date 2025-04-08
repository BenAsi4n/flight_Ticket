// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;

// passport.serializeUser((user, done) => {
//   done(null, user);
// });
// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// const setupGoogleStrategy = () => {
//   passport.use(new GoogleStrategy({
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback"
//     },
//     (accessToken, refreshToken, profile, done) => {
//       // Ở đây bạn có thể lưu user vào DB nếu cần
//       return done(null, profile);
//     }
//   ));
// };

// module.exports = {
//   setupGoogleStrategy
// };
