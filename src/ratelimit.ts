import type { NextApiRequest, NextApiResponse } from 'next';
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'

const applyMiddleware = (middleware: any) => (request: NextApiRequest, response: NextApiResponse) =>
    new Promise((resolve, reject) => {
        middleware(request, response, (result: any) =>
            result instanceof Error ? reject(result) : resolve(result)
        )
    })

const getIP = (request: any) =>
    request?.ip ||
    request?.headers['x-forwarded-for'] ||
    request?.headers['x-real-ip'] ||
    request?.socket.remoteAddress

export const getRateLimitMiddlewares = ({
    limit = 60,
    windowMs = 60 * 1000,
    delayAfter = Math.round(10 / 2),
    delayMs = 500,
} = {}) => [
        slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
        rateLimit({ keyGenerator: getIP, windowMs, max: limit }),
    ]

const middlewares = getRateLimitMiddlewares();

async function applyRateLimit(request: any, response: any) {
    await Promise.all(
        middlewares
            .map(applyMiddleware)
            .map(middleware => middleware(request, response))
    )
}

export default applyRateLimit