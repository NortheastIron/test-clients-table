import { TableEvents } from '@features/clients/components/table';

export type TableEvent = {
    type: TableEvents;
    value: any;
};