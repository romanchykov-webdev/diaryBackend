import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { CardsService } from "./cards.service";
import { CreateCardDTO } from "./dto/create-card.dto";
import { JwtAuthGuard } from "../../guards/jwt-guard";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { UpdateCardDTO } from "./dto/update-card.dto";

@Controller("cards")
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  // create new Card
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

  // get all Cards
  @ApiTags("API")
  @ApiResponse({ status: 200, type: [CreateCardDTO] })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllCards(@Req() request): Promise<CreateCardDTO[]> {
    const user = request.user;
    return this.cardsService.getAllCards(user.id);
  }

  //   Update card
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
}
