import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { PrismaClient } from '@prisma/client';

import { getRateLimitMiddlewares } from '@/ratelimit';
import applyMiddleware from "@/ratelimit";
import applyRateLimit from '@/ratelimit';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    let stockLow: any = [];
    let orderItems: Array<any> = [];
    const maskCreditCard = (cardNumber: any) => {
        const maskedPart = cardNumber.slice(-4);
        const asterisks = '*'.repeat(3);
        return asterisks + maskedPart;
    }

    if (req.method === 'POST') {
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            return res.status(401).json("Unauthorized access!");
        }
        try {
            await applyRateLimit(req, res)
        } catch {
            return res.status(429).json('Too Many Requests')
        }
        try {
            const itemIds = req.body.cart.map((item: any) => item.id);
            const user = await prisma.user.findUnique({
                where: {
                    email: session?.user?.email || ''
                }
            });

            const lowStockItems = await prisma.product.findMany({
                where: {
                    id: {
                        in: itemIds
                    },
                    stock: {
                        lte: 0
                    }
                }
            });

            if (lowStockItems.length > 0) {
                return res.status(404).json("Apologies, some items are unavailable for now. Please save them for future purchase. We appreciate your patience.");
            }
            const placeOrder = await prisma.order.create({
                data: {
                    userId: user?.id || 0,
                    paymentType: req.body?.cardType,
                    lastDigits: maskCreditCard(req.body?.cardNumber),
                    status: "processing"
                }
            });
            if (placeOrder && Object.keys(placeOrder).length > 0) {
                for (const product of req.body.cart) {
                    const orderItem = await prisma.orderItem.create({
                        data: {
                            orderId: placeOrder.id,
                            productId: product.id,
                            brandId: product.brand,
                            name: (product?.title) + ((product.capacity !== null) ? ` ${product.capacity}` : '') + ((product.colorName !== null) ? ` ${product.colorName.toUpperCase()}` : '') + ((product.dimensions !== null) ? ` ${product.dimensions}"` : ''),
                            sku: product.sku,
                            price: product.price,
                            delivery: req.body.delivery?.courierName,
                            deliveryPrice: req.body.delivery?.priceIncludingGst,
                            discount: product.discount,
                            quantity: JSON.stringify(product.quantity)
                        }
                    });
                    orderItems.push(orderItem);
                }
                if (orderItems.length > 0) {
                    // Start a database transaction
                    await prisma.$transaction(async (prisma) => {
                        for (const item of orderItems) {
                            const product = await prisma.product.findUnique({
                                where: {
                                    id: item.productId,
                                },
                            });

                            if (product?.stock && product?.stock > 0) {
                                await prisma.product.update({
                                    where: {
                                        id: item.productId,
                                    },
                                    data: {
                                        stock: product.stock - item.quantity,
                                    },
                                });
                            } else {
                                res.status(200).json("Insufficient stock");
                            }
                        }
                    });

                    res.status(200).json({
                        stockError: false,
                        complete: true,
                        order: placeOrder,
                    });
                }
                return res.status(200).json({ stockError: true, stock: stockLow, complete: false, message: "Unable to place order at this time. Please check your payment details and try again." });
            }
            return res.status(200).json({ stockError: true, stock: stockLow, complete: false, message: "Unable to place order at this time. Please check your payment details and try again." });
        } catch (e) {
            return res.status(500).json("Unable to place order at this time. Please check your payment details and try again.");
        } finally {
            await prisma.$disconnect();
        }

    } else {
        return res.status(405).end("Internal server error.");
    }
}