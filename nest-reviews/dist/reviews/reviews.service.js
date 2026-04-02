"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const review_schema_1 = require("./schemas/review.schema");
const reply_schema_1 = require("./schemas/reply.schema");
const notifications_gateway_1 = require("./notifications.gateway");
let ReviewsService = class ReviewsService {
    reviewModel;
    replyModel;
    notificationsGateway;
    constructor(reviewModel, replyModel, notificationsGateway) {
        this.reviewModel = reviewModel;
        this.replyModel = replyModel;
        this.notificationsGateway = notificationsGateway;
    }
    async createReview(data) {
        const review = new this.reviewModel(data);
        const savedReview = await review.save();
        this.notificationsGateway.broadcastNewReview(savedReview);
        return savedReview;
    }
    async findAll() {
        const reviews = await this.reviewModel.find().sort({ createdAt: -1 }).exec();
        const reviewsWithReplies = await Promise.all(reviews.map(async (review) => {
            const replies = await this.replyModel.find({ reviewId: review._id }).exec();
            return {
                ...review.toObject(),
                replies
            };
        }));
        return reviewsWithReplies;
    }
    async getReviewsByProduct(productId) {
        console.log('Fetching reviews for product ID:', productId);
        let query = { productId: productId };
        if (mongoose_2.Types.ObjectId.isValid(productId)) {
            query = {
                $or: [
                    { productId: productId },
                    { productId: new mongoose_2.Types.ObjectId(productId) }
                ]
            };
        }
        const reviews = await this.reviewModel.find(query).sort({ createdAt: -1 }).exec();
        const reviewsWithReplies = await Promise.all(reviews.map(async (review) => {
            const replies = await this.replyModel.find({ reviewId: review._id }).exec();
            return {
                ...review.toObject(),
                replies
            };
        }));
        return reviewsWithReplies;
    }
    async addReply(reviewId, data) {
        const review = await this.reviewModel.findById(reviewId);
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        const reply = new this.replyModel({
            reviewId: new mongoose_2.Types.ObjectId(reviewId),
            ...data,
        });
        const savedReply = await reply.save();
        this.notificationsGateway.sendDirectNotification(review.userId.toString(), 'new_reply', {
            message: `${data.userName} replied to your review!`,
            reply: savedReply
        });
        return savedReply;
    }
    async toggleLike(reviewId, userId) {
        const review = await this.reviewModel.findById(reviewId);
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const likeIndex = review.likes.indexOf(userObjectId);
        if (likeIndex === -1) {
            review.likes.push(userObjectId);
            this.notificationsGateway.sendDirectNotification(review.userId.toString(), 'review_liked', {
                message: `Someone liked your review!`,
                reviewId
            });
        }
        else {
            review.likes.splice(likeIndex, 1);
        }
        return await review.save();
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __param(1, (0, mongoose_1.InjectModel)(reply_schema_1.Reply.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        notifications_gateway_1.NotificationsGateway])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map