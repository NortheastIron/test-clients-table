import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { SimplebarAngularModule } from 'simplebar-angular';

import { UserExtended } from '@features/clients/types';
import { TableEvents, TableEvent } from '@features/clients/components/table';

@Component({
    selector: 'app-clients-table',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatTableModule, MatCheckboxModule, SimplebarAngularModule],
    templateUrl: './clients.table.component.html',
    styleUrl: './clients.table.component.scss'
})
export class ClientsTableComponent {

    protected options = {autoHide: false, forceVisible: true, scrollbarMaxSize: 250};

    @Input() set tableData(data: UserExtended[]  | null) {
        this.dataSource.data = data || [];
        this.selection.clear();
    }

    @Output() appTableEvent = new EventEmitter<TableEvent>();

    protected displayedColumns: string[] = [
        'select',
        'name',
        'surname',
        'email',
        'phone',
        'filler'
    ];
    protected dataSource = new MatTableDataSource<UserExtended>([]);
    protected selection = new SelectionModel<UserExtended>(true, []);

    protected isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    toggleAllRows() {
        if (this.isAllSelected()) {
          this.selection.clear();
          return;
        }
    
        this.selection.select(...this.dataSource.data);
    }

    // protected onRowClick(event: any, row: UserExtended) { //exp тип для ивента должен быть как мышь так и тап
    //     const target = event.target as HTMLElement;
    //     console.log('onROswwad');
    //     // if (!target.closest('mat-checkbox')) {
    //     //     return;
    //     // }

    //     this.onItemClick(event, row);

    //     // this.selection.toggle(row);
    // }

    protected onItemClick(event: any, row: UserExtended) {
        event.stopPropagation();
        console.log('rowClick', row);
        this.appTableEvent.emit({type: TableEvents.ROW_ACTION, value: row['id']});
    }

}