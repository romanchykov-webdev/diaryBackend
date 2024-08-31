import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CardsService } from "./cards.service";
import { CreateCardDTO } from "./dto/create-card.dto";
import { JwtAuthGuard } from "../../guards/jwt-guard";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { UpdateCardDTO } from "./dto/update-card.dto";
import { UpdateCardOrdersDTO } from "./dto/update-card-orders.dto";
import { GetUniqueLabelsDTO } from "./dto/get-unique-labels.dto";

@Controller("cards")
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  // Метод для обновления порядка карточек
  @ApiTags("API")
  @ApiResponse({ status: 200, description: "Card orders successfully updated" })
  @UseGuards(JwtAuthGuard)
  @Patch("update-order")
  async updateCardOrders(
    @Body() updateCardOrdersDTO: UpdateCardOrdersDTO, // Используем DTO для валидации
    @Req() request,
  ): Promise<void> {
    const user = request.user;
    await this.cardsService.updateCardOrders(
      user.id,
      updateCardOrdersDTO.orders,
    );
  }

  // Создание новой карточки
  @ApiTags("API")
  @ApiResponse({ status: 200, type: CreateCardDTO })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createCard(
    @Body() createCardDTO: CreateCardDTO,
    @Req() request,
  ): Promise<CreateCardDTO> {
    const user = request.user;
    return this.cardsService.createCard(user.id, createCardDTO);
  }

  // Получение всех карточек
  @ApiTags("API")
  @ApiResponse({ status: 200, type: [CreateCardDTO] })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllCards(@Req() request): Promise<CreateCardDTO[]> {
    const user = request.user;
    return this.cardsService.getAllCards(user.id);
  }

  // Обновление карточки
  @ApiTags("API")
  @ApiResponse({ status: 200, type: UpdateCardDTO })
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async updateCard(
    @Param("id") cardId: string,
    @Body() updateCardDTO: UpdateCardDTO,
    @Req() request,
  ): Promise<UpdateCardDTO> {
    const user = request.user;
    return this.cardsService.updateCard(user.id, cardId, updateCardDTO);
  }

  // Получение id и labels карточек пользователя
  @UseGuards(JwtAuthGuard)
  @Get("card-ids")
  async getCardIdsAndLabels(@Req() req) {
    const userId = req.user.id;
    return this.cardsService.getCardIdsAndLabelsForUser(userId);
  }

  // Метод для получения одной карточки по ID
  @ApiTags("API")
  @ApiResponse({ status: 200, type: CreateCardDTO })
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getCardById(
    @Param("id") cardId: string,
    @Req() request,
  ): Promise<CreateCardDTO> {
    const user = request.user;
    return this.cardsService.getCardById(user.id, cardId);
  }
}
