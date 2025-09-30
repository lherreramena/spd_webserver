const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

require('dotenv').config();

const urlRender = process.env.URL_RENDER
const callbackURLLocal = '/auth/google/callback'


const LOCAL_PORT = process.env.DEFAULT_LOCAL_PORT;
const PORT = process.env.PORT || LOCAL_PORT;


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: (PORT !== LOCAL_PORT ? urlRender : '') + callbackURLLocal
}, async (accessToken, refreshToken, profile, done) => {
  // Aquí puedes guardar al usuario en tu base de datos
    try {
      // Buscar usuario por ID de Google
      let user = await db_support.usersDB.findOne({ googleId: profile.id });

      if (user === undefined) {
        console.log('User undefined');
      }
      // Si no existe, podés crearlo o manejarlo como desees
      if (!user || user === undefined) {
        console.log(`Usuario ${profile.emails[0].value} no encontrado`)
        user = await db_support.usersDB.create({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails?.[0].value || '',
          photo: profile.photos?.[0].value || '',
          personalInfo: {nombres: profile.name.givenName, apellidos: profile.name.familyName},
          listaHijosColegio: null,
          listaPadres: null,
          listaOtros: null,
          listaAsistentes: null,
          pagos: null
        });
        //console.log('User:', user);
      } /*else {
        console.log('Found user:', user.username);
      }*/

      return done(null, profile);
    } catch (err) {
      return done(err, null);
    }
}));

// Serializar usuario
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));


module.exports = passport;
