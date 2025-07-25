import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { TableEvents } from '@shared/components/table/enums';
import { ColumnConfig, TableElement, TableEvent } from '@shared/components/table/types';

@Component({
    selector: 'app-table',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatTableModule, MatCheckboxModule],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss'
})
export class TableComponent {

    protected displayedColumns: string[] = [];
    private _columns: ColumnConfig[] = [];

    @Input() set columns(columns: ColumnConfig[]) {
        this._columns = columns;
        this.displayedColumns = ['select', ...columns.map(col => col.key)];
    }
    get columns(): ColumnConfig[] {
        return this._columns;
    }

    @Input() set tableData(data: TableElement[]  | null) {
        this.dataSource.data = data || [];
        this.selection.clear();
    }

    @Output() appTableEvent = new EventEmitter<TableEvent>();

    protected dataSource = new MatTableDataSource<TableElement>([]);
    protected selection = new SelectionModel<TableElement>(true, []); //exp true?

    // ngOnChanges(changes: SimpleChanges) {
    //     if (changes['columns']) {
    //         this.displayedColumns = ['select', ...this.columns.map(col => col.key)];
    //     }
    // }

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

    protected onRowClick(event: any, row: TableElement) { //exp тип для ивента должен быть как мышь так и тап
        console.log('eventClickRow', event);

        this.selection.toggle(row);
    }

    protected onItemClick(event: any, row: TableElement) {
        event.stopPropagation();
        console.log('rowClick', row);
        this.appTableEvent.emit({type: TableEvents.ROW_ACTION, value: row['id']});
    }

}