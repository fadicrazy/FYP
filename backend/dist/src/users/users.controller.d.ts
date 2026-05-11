import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(role?: string): Promise<import("./user.schema").UserDocument[]>;
    findOne(id: string): Promise<import("./user.schema").UserDocument | null>;
    update(id: string, body: any): Promise<import("./user.schema").UserDocument | null>;
    remove(id: string): Promise<import("./user.schema").UserDocument | null>;
}
