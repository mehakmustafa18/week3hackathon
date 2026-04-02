import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    createReview(data: any): Promise<import("./schemas/review.schema").Review>;
    getAllReviews(): Promise<any[]>;
    getReviews(productId: string): Promise<any[]>;
    addReply(reviewId: string, data: any): Promise<import("./schemas/reply.schema").Reply>;
    toggleLike(reviewId: string, data: any): Promise<import("./schemas/review.schema").Review>;
}
