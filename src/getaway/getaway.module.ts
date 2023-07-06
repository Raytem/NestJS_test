import { Module } from '@nestjs/common';
import { Getaway } from './getaway';

@Module({
  providers: [Getaway],
})
export class GetawayModule {}
