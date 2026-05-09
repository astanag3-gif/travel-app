import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ExcursionsModule } from './excursions/excursions.module';
import { BookingsModule } from './bookings/bookings.module';
import { TagsModule } from './tags/tags.module'; 

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CategoriesModule,
    ExcursionsModule,
    BookingsModule,
    TagsModule,
  ],
})
export class AppModule {}