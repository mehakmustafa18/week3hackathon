import { Model } from 'mongoose';
import { Review } from './schemas/review.schema';
import { Reply } from './schemas/reply.schema';
import { NotificationsGateway } from './notifications.gateway';
export declare class ReviewsService {
    private reviewModel;
    private replyModel;
    private notificationsGateway;
    constructor(reviewModel: Model<Review>, replyModel: Model<Reply>, notificationsGateway: NotificationsGateway);
    createReview(data: any): Promise<Review>;
    findAll(): Promise<any[]>;
    getReviewsByProduct(productId: string): Promise<any[]>;
    addReply(reviewId: string, data: any): Promise<Reply>;
    toggleLike(reviewId: string, userId: string): Promise<Review>;
}
