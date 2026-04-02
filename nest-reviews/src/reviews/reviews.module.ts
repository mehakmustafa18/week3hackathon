import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Review, ReviewSchema } from './schemas/review.schema';
import { Reply, ReplySchema } from './schemas/reply.schema';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Reply.name, schema: ReplySchema },
    ]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, NotificationsGateway],
})
export class ReviewsModule {}
