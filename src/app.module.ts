import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { FavouriteModule } from './favourite/favourite.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ProductModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'react_native_fashion',
      autoLoadEntities: true,
      synchronize: true,
    }),
    FavouriteModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
