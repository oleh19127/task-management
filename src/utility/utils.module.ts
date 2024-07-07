import { Module } from '@nestjs/common';
import { PasswordToolService } from './password-tool.service';

@Module({
  providers: [PasswordToolService],
  exports: [PasswordToolService],
})
export class UtilityModule {}
