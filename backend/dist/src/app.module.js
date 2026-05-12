"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const os_1 = require("os");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const patients_module_1 = require("./patients/patients.module");
const vitals_module_1 = require("./vitals/vitals.module");
const consultations_module_1 = require("./consultations/consultations.module");
const prescriptions_module_1 = require("./prescriptions/prescriptions.module");
const deliveries_module_1 = require("./deliveries/deliveries.module");
const admin_module_1 = require("./admin/admin.module");
const uploads_module_1 = require("./uploads/uploads.module");
const chat_module_1 = require("./chat/chat.module");
const video_module_1 = require("./video/video.module");
const logger = new common_1.Logger('AppModule');
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            mongoose_1.MongooseModule.forRootAsync({
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
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: process.env.VERCEL ? (0, path_1.join)((0, os_1.tmpdir)(), 'uploads') : (0, path_1.join)(__dirname, '..', 'uploads'),
                serveRoot: '/uploads',
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            patients_module_1.PatientsModule,
            vitals_module_1.VitalsModule,
            consultations_module_1.ConsultationsModule,
            prescriptions_module_1.PrescriptionsModule,
            deliveries_module_1.DeliveriesModule,
            admin_module_1.AdminModule,
            uploads_module_1.UploadsModule,
            chat_module_1.ChatModule,
            video_module_1.VideoModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map