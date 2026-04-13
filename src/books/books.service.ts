import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBookDto } from 'src/common/dtos/create-book.dto';
import { UpdateBookDto } from 'src/common/dtos/update-book.dto';
import { Book, BookDocument } from './book.schema';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  // userId ensures each user only sees their own books
  async findAll(userId: string): Promise<Book[]> {
    return this.bookModel.find({ userId }).exec();
  }

  // userId ensures a user can't read someone else's book by guessing an ID
  async findOne(id: string, userId: string): Promise<Book> {
    const book = await this.bookModel.findOne({ _id: id, userId }).exec();
    if (!book) throw new NotFoundException(`Book #${id} not found`);
    return book;
  }

  async create(dto: CreateBookDto, userId: string): Promise<Book> {
    // Check if this user already has a book with the same title (case-insensitive)
    const duplicate = await this.bookModel.findOne({
      userId,
      title: { $regex: new RegExp(`^${dto.title}$`, 'i') },
    });
    if (duplicate) {
      throw new ConflictException(
        `You already have a book called "${dto.title}"`,
      );
    }

    // Spread the DTO fields and attach the userId as the owner
    return this.bookModel.create({ ...dto, userId });
  }

  async update(id: string, dto: UpdateBookDto, userId: string): Promise<Book> {
    // If the title is being changed, check the new title isn't a duplicate
    if (dto.title) {
      const duplicate = await this.bookModel.findOne({
        userId,
        title: { $regex: new RegExp(`^${dto.title}$`, 'i') },
        _id: { $ne: id }, // exclude the current book from the check
      });
      if (duplicate) {
        throw new ConflictException(
          `You already have a book called "${dto.title}"`,
        );
      }
    }

    // findOneAndUpdate with userId in the filter so users can't update
    // each other's books even if they know the ID
    const updated = await this.bookModel
      .findOneAndUpdate({ _id: id, userId }, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Book #${id} not found`);
    return updated;
  }

  async remove(id: string, userId: string): Promise<void> {
    // Same pattern — filter by both _id and userId for security
    const result = await this.bookModel
      .findOneAndDelete({ _id: id, userId })
      .exec();
    if (!result) throw new NotFoundException(`Book #${id} not found`);
  }
}
