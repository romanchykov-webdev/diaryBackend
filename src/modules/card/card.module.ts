import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from '../user/user.module'; // Импорт UserModule
import { Card } from './models/card.model';
import { CardsService } from './cards.service'; // Путь к cards.service
import { CardsController } from './cards.controller'; // Путь к cards.controller

@Module({
  imports: [
    SequelizeModule.forFeature([Card]),
    UserModule, // Добавить UserModule в импортируемые модули
  ],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardModule {}
