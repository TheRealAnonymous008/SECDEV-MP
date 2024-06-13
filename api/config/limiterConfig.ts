
import { rateLimit } from 'express-rate-limit';

// Rate limiter for login capping
export const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute window
	limit: 5, // Limit each IP to 10 requests per `window`
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
	message: "Too many requests. Try again later",
});