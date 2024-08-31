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
    @InjectModel(Card)
    private readonly cardModel: typeof Card,
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
  // Метод для обновления порядка карточек
  async updateCardOrders(
    userId: number,
    updatedOrders: { id: string; order: number }[],
  ): Promise<void> {
    const transaction = await this.cardRepository.sequelize.transaction();

    try {
      for (const { id, order } of updatedOrders) {
        await this.cardRepository.update(
          { order },
          {
            where: {
              id,
              userId,
            },
            transaction,
          },
        );
      }

      await transaction.commit();
      this.logger.log(
        `Card orders successfully updated for user id: ${userId}`,
      );
    } catch (error) {
      await transaction.rollback();
      this.logger.error(
        `Failed to update card orders for user id: ${userId}`,
        error.stack,
      );
      throw error;
    }
  }

  // Метод для получения одной карточки по ID
  async getCardById(userId: number, cardId: string): Promise<Card> {
    const card = await this.cardRepository.findOne({
      where: { id: cardId, userId },
    });

    if (!card) {
      throw new BadRequestException(AppError.CARD_NOT_FOUND);
    }

    this.logger.log(`Card with id ${cardId} retrieved for user id: ${userId}`);
    return card;
  }

  // Метод для получения id и labels карточек пользователя
  async getCardIdsAndLabelsForUser(userId: number) {
    try {
      const cards = await this.cardModel.findAll({
        attributes: ["id", "labels"], // Извлечение id и labels
        where: { userId },
      });

      // const ids = cards.map((card) => card.id); // Массив id карточек
      const allLabels = cards.flatMap((card) => card.labels); // Объединение всех labels
      const uniqueLabels = [...new Set(allLabels)]; // Уникальные labels

      return {
        // ids,
        labels: uniqueLabels,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get card IDs and labels for user ${userId}`,
        error,
      );
      throw error;
    }
  }
}
