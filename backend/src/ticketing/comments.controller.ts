import { Controller, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../iam/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tickets/:id/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  addComment(
    @Param('id') ticketId: string,
    @Body('content') content: string,
    @Body('is_internal') isInternal: boolean,
    @Request() req: any
  ) {
    const userId = req.user.userId;
    // Default to false if not provided
    const internal = isInternal === true;
    return this.commentsService.addComment(+ticketId, userId, content, internal);
  }
}
