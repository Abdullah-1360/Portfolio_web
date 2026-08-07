import { Module } from '@nestjs/common';
import { RouterDbService } from './router-db.service';
import { RouterHealthService } from './router-health.service';
import { RouterReservationService } from './router-reservation.service';
import { RouterSelectorService } from './router-selector.service';
import { RouterLoggerService } from './router-logger.service';
import { ProviderDispatcherService } from './provider-dispatcher.service';
import { RouterGraphService } from './router-graph.service';

@Module({
  providers: [
    RouterDbService,
    RouterHealthService,
    RouterReservationService,
    RouterSelectorService,
    RouterLoggerService,
    ProviderDispatcherService,
    RouterGraphService,
  ],
  exports: [RouterGraphService, RouterHealthService, RouterDbService],
})
export class RouterModule {}
