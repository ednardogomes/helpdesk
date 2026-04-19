import { api } from './api';
import type { Ticket } from '../types';

export const TicketService = {
    async getMyTickets(): Promise<Ticket[]> {
        const { data } = await api.get<Ticket[]>('/tickets/my-tickets');
        return data;
    }
};
