import { api } from './api';
import type { User } from '../types';

export const UserService = {
    async me(): Promise<User> {
        const { data } = await api.get<User>('/users/me');
        return data;
    }
};
