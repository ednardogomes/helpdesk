import { Controller, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../iam/auth/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';

@UseGuards(JwtAuthGuard)
@Controller('tickets/:id/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  addComment(
    @Param('id') ticketId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Body('is_internal') isInternal: boolean,
    @Request() req: any
  ) {
    const userId = req.user.userId;
    // Default to false if not provided
    const internal = isInternal === true;
    return this.commentsService.addComment(+ticketId, userId, createCommentDto.content, internal);
  }
}
