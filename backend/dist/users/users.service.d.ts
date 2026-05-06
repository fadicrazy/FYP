import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(userData: Partial<User>): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    findAll(role?: string): Promise<UserDocument[]>;
    update(id: string, data: Partial<User>): Promise<UserDocument | null>;
    remove(id: string): Promise<UserDocument | null>;
    countByRole(): Promise<any>;
    getRecentUsers(limit?: number): Promise<UserDocument[]>;
}
