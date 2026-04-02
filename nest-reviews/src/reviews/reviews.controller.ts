import { Controller, Post, Get, Body, Param, Put, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('/')
  async createReview(@Body() data: any) {
    return await this.reviewsService.createReview(data);
  }

  @Get('/')
  async getAllReviews() {
    return await this.reviewsService.findAll();
  }

  @Get('/product/:productId')
  async getReviews(@Param('productId') productId: string) {
    return await this.reviewsService.getReviewsByProduct(productId);
  }

  @Post('/:id/reply')
  async addReply(@Param('id') reviewId: string, @Body() data: any) {
    return await this.reviewsService.addReply(reviewId, data);
  }

  @Put('/:id/like')
  async toggleLike(@Param('id') reviewId: string, @Body() data: any) {
    return await this.reviewsService.toggleLike(reviewId, data.userId);
  }
}
