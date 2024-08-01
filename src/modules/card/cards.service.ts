import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Card } from "./models/card.model";
import { CreateCardDTO } from "./dto/create-card.dto";
import { UpdateCardDTO } from "./dto/update-card.dto";
import { AppError } from "../../common/constants/errors";

@Injectable()
export class CardsService {
  private readonly logger = new Logger(CardsService.name);

  constructor(
    @InjectModel(Card) private readonly cardRepository: typeof Card,
  ) {}

  // create new Card
  async createCard(
    userId: number,
    createCardDTO: CreateCardDTO,
  ): Promise<Card> {
    const cardCount = await this.cardRepository.count({ where: { userId } });
    const newCard = await this.cardRepository.create({
      userId,
      ...createCardDTO,
      order: cardCount + 1,
    });
    this.logger.log("Card successfully created for user id: " + userId);
    return newCard;
  }

  // get all cards
  async getAllCards(userId: number): Promise<Card[]> {
    const cards = await this.cardRepository.findAll({
      where: { userId },
      order: [["order", "DESC"]], // Сортировка по полю order
    });
    this.logger.log("Retrieved cards for user id: " + userId);
    return cards;
  }

  // update card
  async updateCard(
    userId: number,
    cardId: string,
    updateCardDTO: UpdateCardDTO,
  ): Promise<Card> {
    const card = await this.cardRepository.findOne({
      where: { id: cardId, userId },
    });

    if (!card) {
      throw new BadRequestException(AppError.CARD_NOT_FOUND);
    }

    if (updateCardDTO.order !== undefined) {
      await this.reorderCards(userId, card.order, updateCardDTO.order);
      card.order = updateCardDTO.order;
    }

    await card.update(updateCardDTO);
    this.logger.log("Card successfully updated for user id: " + userId);
    return card;
  }

  // helper method to reorder cards
  private async reorderCards(
    userId: number,
    currentOrder: number,
    newOrder: number,
  ): Promise<void> {
    if (currentOrder < newOrder) {
      await this.cardRepository.increment("order", {
        by: -1,
        where: {
          userId,
          order: {
            $gt: currentOrder,
            $lte: newOrder,
          },
        },
      });
    } else if (currentOrder > newOrder) {
      await this.cardRepository.increment("order", {
        by: 1,
        where: {
          userId,
          order: {
            $lt: currentOrder,
            $gte: newOrder,
          },
        },
      });
    }
  }
}
