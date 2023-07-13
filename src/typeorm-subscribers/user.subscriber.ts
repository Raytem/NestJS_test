import { User } from 'src/decorators/reqUser.decorator';
import { UserEntity } from 'src/realizations/user/entities/user.entity';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  LoadEvent,
  RecoverEvent,
} from 'typeorm';

@EventSubscriber()
export class UserEntitySubscriber
  implements EntitySubscriberInterface<UserEntity>
{
  // constructor(dataSource: DataSource) {
  //   dataSource.subscribers.push(this);
  // }

  listenTo(): string | Function {
    return UserEntity;
  }

  afterLoad(
    entity: UserEntity,
    event?: LoadEvent<UserEntity>,
  ): void | Promise<any> {
    // console.log(entity);
    console.log('----dbData----');
  }

  beforeRemove(event: RecoverEvent<UserEntity>): void | Promise<any> {
    console.log('---rmUser');
  }
}
