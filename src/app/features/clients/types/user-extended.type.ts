import { User } from '@features/clients/types/user.type';

export type UserExtended = User & {
    id: string;
};