import { Module, OnModuleInit } from '@nestjs/common';
import { CommandBus } from './command-bus';
import { EventBus } from './event-bus';
import { EventPublisher } from './event-publisher';
import { QueryBus } from './query-bus';
import { ExplorerService } from './services/explorer.service';

@Module({
  providers: [CommandBus, QueryBus, EventBus, EventPublisher, ExplorerService],
  exports: [CommandBus, QueryBus, EventBus, EventPublisher],
})
export class CqrsModule implements OnModuleInit {
  constructor(
    private readonly explorerService: ExplorerService,
    private readonly eventsBus: EventBus,
    private readonly commandsBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  onModuleInit() {
    const { events, queries, sagas, commands } = this.explorerService.explore();

    this.eventsBus.register(events);
    this.commandsBus.register(commands);
    this.queryBus.register(queries);
    this.eventsBus.registerSagas(sagas);
  }
}
