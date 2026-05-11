import { UserRole } from '../../users/user.schema';
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    specialization?: string;
    licenseNumber?: string;
    area?: string;
}
