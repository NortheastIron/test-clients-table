import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject } from 'rxjs';

import { PageHeaderComponent } from '@shared';
// import { TableElement } from '@shared/components/table/types';

import { User, UserExtended } from '@features/clients/types';
// import { UserExtended } from '@features/clients/types/user-extended.type';
import { ClientsTableComponent, TableEvent } from '@features/clients/components/table';
// import { TableEvent } from '@features/clients/components/table/types';

@Component({
    selector: 'app-clients-page',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent,
    // TableComponent,
    AsyncPipe,
    ClientsTableComponent
],
    templateUrl: './clients.page.component.html',
    styleUrl: './clients.page.component.scss',
})
export class ClientsPageComponent {

    protected pageTitle: string = 'Клиенты';
    // protected tableColumns: ColumnConfig[] = [
    //     { key: 'name', name: 'Имя', isAction: true, width: 280 },
    //     { key: 'surname', name: 'Фамилия' },
    //     { key: 'email', name: 'E-mail' },
    //     { key: 'phone', name: 'Телефон' }
    // ];
    protected dataSource = new BehaviorSubject<UserExtended[]>([]);
    protected selectionItems = new BehaviorSubject([]);//exp type

    protected testData: UserExtended[] = [
        { id: 1, name: 'Иван', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 2, name: 'Петя', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 3, name: 'Дима', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'}
    ];

    protected testData2: UserExtended[] = [
        { id: 1, name: 'Иван', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 2, name: 'Петя', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 3, name: 'Дима', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 1, name: 'Иван', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 2, name: 'Петя', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 3, name: 'Дима', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 1, name: 'Иван', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 2, name: 'Петя', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 3, name: 'Дима', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 3, name: 'Дима', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 1, name: 'Иван', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 2, name: 'Петя', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 3, name: 'Дима', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 1, name: 'Иван', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 2, name: 'Петя', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 3, name: 'Дима', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 3, name: 'Дима', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 1, name: 'Иван', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 2, name: 'Петя', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 3, name: 'Дима', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 1, name: 'Иван', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 2, name: 'Петя', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 3, name: 'Дима', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 3, name: 'Дима', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 1, name: 'Иван', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 2, name: 'Петя', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 3, name: 'Дима', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 1, name: 'Иван', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 2, name: 'Петя', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'},
        { id: 3, name: 'Дима', surname: 'Иванов', phone: '+786456548484', email: 'ara@ara.ra'}
    ];

    ngOnInit() {
        this.loadData();
    }

    protected loadData() {
        setTimeout(() => {
            // this.dataSource.next(this.testData);
        }, 2500);

        setTimeout(() => {
            this.dataSource.next(this.testData2);
        }, 3000);
    }

    protected onTableEvent(event: TableEvent) {
        console.log('onTE', event);
    }
}