import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { tmpdir } from 'os';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PatientsModule } from './patients/patients.module';
import { VitalsModule } from './vitals/vitals.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { AdminModule } from './admin/admin.module';
import { UploadsModule } from './uploads/uploads.module';
import { ChatModule } from './chat/chat.module';
import { VideoModule } from './video/video.module';
import { NotificationsModule } from './notifications/notifications.module';
import { InventoryModule } from './inventory/inventory.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const logger = new Logger('AppModule');

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({ isGlobal: true }),

    // MongoDB connection
    MongooseModule.forRootAsync({
      useFactory: () => {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/telehealth';
        logger.log(`Connecting to MongoDB...`);
        return {
          uri,
          connectionFactory: (connection) => {
            connection.on('connected', () => logger.log('Successfully connected to MongoDB'));
            connection.on('error', (err) => logger.error(`MongoDB connection error: ${err.message}`));
            return connection;
          }
        };
      },
    }),

    ServeStaticModule.forRoot({
      rootPath: process.env.VERCEL ? join(tmpdir(), 'uploads') : join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    PatientsModule,
    VitalsModule,
    ConsultationsModule,
    PrescriptionsModule,
    DeliveriesModule,
    AdminModule,
    UploadsModule,
    ChatModule,
    VideoModule,
    NotificationsModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
