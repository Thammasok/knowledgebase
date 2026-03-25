import { rateLimit, RateLimitRequestHandler } from 'express-rate-limit'

const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: 1 * 60 * 1000, // 10 minutes
  limit: 200, // Limit each IP to 100 requests per `window` (here, per 10 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  validate: {
    xForwardedForHeader: false,
    default: true,
    trustProxy: false,
  },
  statusCode: 429,
  message: {
    message: 'Too many request',
  },
})

// Apply the rate limiting middleware to all requests.
export default limiter
