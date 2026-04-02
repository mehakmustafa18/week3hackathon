import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review } from './schemas/review.schema';
import { Reply } from './schemas/reply.schema';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Reply.name) private replyModel: Model<Reply>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async createReview(data: any): Promise<Review> {
    const review = new this.reviewModel(data);
    const savedReview = await review.save();
    
    // Notify all users about the new review
    this.notificationsGateway.broadcastNewReview(savedReview);
    
    return savedReview;
  }
  async findAll(): Promise<any[]> {
    const reviews = await this.reviewModel.find().sort({ createdAt: -1 }).exec();
    
    // For each review, let's also fetch its replies
    const reviewsWithReplies = await Promise.all(reviews.map(async (review) => {
      const replies = await this.replyModel.find({ reviewId: review._id }).exec();
      return { 
        ...review.toObject(),
        replies
      };
    }));
    
    return reviewsWithReplies;
  }

  async getReviewsByProduct(productId: string): Promise<any[]> {
    console.log('Fetching reviews for product ID:', productId);
    // Use a flexible query that handles both ObjectId and string formats
    let query: any = { productId: productId };
    if (Types.ObjectId.isValid(productId)) {
      query = { 
        $or: [
          { productId: productId },
          { productId: new Types.ObjectId(productId) }
        ]
      };
    }
    
    const reviews = await this.reviewModel.find(query).sort({ createdAt: -1 }).exec();
    
    // For each review, let's also fetch its replies
    const reviewsWithReplies = await Promise.all(reviews.map(async (review) => {
      const replies = await this.replyModel.find({ reviewId: review._id }).exec();
      return { 
        ...review.toObject(),
        replies
      };
    }));
    
    return reviewsWithReplies;
  }

  async addReply(reviewId: string, data: any): Promise<Reply> {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');

    const reply = new this.replyModel({
      reviewId: new Types.ObjectId(reviewId),
      ...data,
    });
    
    const savedReply = await reply.save();
    
    // Notify the review author that someone replied to their review
    this.notificationsGateway.sendDirectNotification(
      review.userId.toString(),
      'new_reply',
      { 
        message: `${data.userName} replied to your review!`,
        reply: savedReply 
      }
    );

    return savedReply;
  }

  async toggleLike(reviewId: string, userId: string): Promise<Review> {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');

    const userObjectId = new Types.ObjectId(userId);
    const likeIndex = review.likes.indexOf(userObjectId);

    if (likeIndex === -1) {
      // Like it
      review.likes.push(userObjectId);
      
      // Notify review author
      this.notificationsGateway.sendDirectNotification(
        review.userId.toString(),
        'review_liked',
        { 
          message: `Someone liked your review!`,
          reviewId
        }
      );
    } else {
      // Unlike it
      review.likes.splice(likeIndex, 1);
    }

    return await review.save();
  }
}
