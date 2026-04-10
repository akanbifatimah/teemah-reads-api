import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from 'src/common/dtos/create-book.dto';
import { UpdateBookDto } from 'src/common/dtos/update-book.dto';

@ApiTags('books') // groups all routes under "books" in the UI
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200, description: 'Returns array of books' })
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one book by ID' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Returns the book' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'Book created successfully' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a book' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Book updated successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.booksService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 204, description: 'Book deleted' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
