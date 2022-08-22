import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  // imports: [UserModule],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
