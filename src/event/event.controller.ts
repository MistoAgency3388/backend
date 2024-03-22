import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/auth/guards/admin.guard';
import { Event } from './entities/event.entity';

@ApiTags('events')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({ summary: 'create event  by admin' })
  @ApiResponse({ type: Event })
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Patch(':eventId')
  @ApiOperation({ summary: 'update event by admin' })
  @ApiResponse({ type: Event })
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  async update(
    @Param('eventId') eventId: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.update(eventId, updateEventDto);
  }

  @Delete(':eventId')
  @ApiOperation({ summary: 'delete event by admin' })
  @ApiResponse({ type: Event })
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  remove(@Param('eventId') eventId: number) {
    return this.eventService.remove(eventId);
  }
}
