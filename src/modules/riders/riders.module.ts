import { Module } from '@nestjs/common';
import { RidersService } from './riders.service';
import { RidersController } from './riders.controller';
import { PrismaModule } from 'src/modules/prisma';

@Module({
  imports: [PrismaModule],
  controllers: [RidersController],
  providers: [RidersService],
})
export class RidersModule {}
