
import { rateLimit } from 'express-rate-limit';

// Rate limiter for login capping
export const limiter = rateLimit({
	windowMs: parseInt(process.env.RATE_LIMITER_WINDOW_MS), // 1 minute window
	limit: parseInt(process.env.RATE_LIMITER_LIMIT), // Limit each IP to 10 requests per `window`
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
	message: "Too many requests. Try again later",
});