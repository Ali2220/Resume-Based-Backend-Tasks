const helmet = require("helmet");
const sanitize = require("express-mongo-sanitize");
const cors = require("cors");

// a) contentSecurityPolicy (CSP)
// Ye browser ko bata raha hai ki kaunse resources load kar sakta hai.
// 1. defaultSrc: ["'self'"] → by default sirf apni site ka content load hoga
// 2 .styleSrc: ["'self'", "'unsafe-inline'"] → CSS sirf apni site se ya inline CSS allowed hai
// 3. scriptSrc: ["'self'"] → JS sirf apni site se load ho sakta hai
// 4. imgSrc: ["'self'", "data:", "https:"] → images sirf apni site, data URLs, ya https sources se aayenge
// Basically ye CSP XSS aur malicious resource loading se protect karta hai.

// b) crossOriginEmbedderPolicy: false
// Ye COEP (Cross-Origin Embedder Policy) hai
// Agar true → browsers ko strict CORS rules follow karne padte hain, jaise shared memory / cross-origin resource loading
// Agar false → easy mode, mostly local development ya simple APIs ke liye
// Industry me production mai usually strict rakha jata hai, dev mai false rakhte hain.

const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Easy mode mein false rakha
});

// 2. Mongo Sanitize - NoSQL Injection rokne ke liye
// Ye $gt, $ne waghera operators ko clean kar deta hai
const sanitizeConfig = sanitize({
  replaceWith: "_", // $ ko _ mai convert krdega
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized: ${key}`);
  },
});

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://mydomain.com" // agr node environment production hai to mydomain.com wala url allow hoga
      : "https://localhost:3000", // agr node env production nhi hai to localhost chlge ga.

   credentials: true, // cookies allow krne ke liye
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   allowedHeaders: ['Content-Type', 'Authorization']

};

const corsConfig = cors(corsOptions)

module.exports = {
    helmetConfig,
    sanitizeConfig,
    corsConfig
}