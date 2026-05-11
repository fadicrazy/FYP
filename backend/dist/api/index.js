"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const server = (0, express_1.default)();
let app;
async function bootstrap() {
    if (!app) {
        const expressAdapter = new platform_express_1.ExpressAdapter(server);
        app = await core_1.NestFactory.create(app_module_1.AppModule, expressAdapter);
        const configService = app.get(config_1.ConfigService);
        app.enableCors({
            origin: configService.get('FRONTEND_URL') || '*',
            credentials: true,
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        app.setGlobalPrefix('api');
        await app.init();
    }
    return server;
}
async function handler(req, res) {
    const expressApp = await bootstrap();
    expressApp(req, res);
}
//# sourceMappingURL=index.js.map