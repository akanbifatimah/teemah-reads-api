import {
  Controller, Get, Post, Put, Delete,
  Body, Param, HttpCode, HttpStatus,
  UseGuards, Request,   // add Request here
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from 'src/common/dtos/create-book.dto';
import { UpdateBookDto } from 'src/common/dtos/update-book.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('books')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200, description: 'Returns array of books' })
  findAll(@Request() req) {
    // req.user.userId comes from JwtStrategy.validate()
    return this.booksService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one book by ID' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Returns the book' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.booksService.findOne(id, req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'Book created successfully' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateBookDto, @Request() req) {
    return this.booksService.create(dto, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a book' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Book updated successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  update(@Param('id') id: string, @Body() dto: UpdateBookDto, @Request() req) {
    return this.booksService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 204, description: 'Book deleted' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() req) {
    return this.booksService.remove(id, req.user.userId);
  }
}