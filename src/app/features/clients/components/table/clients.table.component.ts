import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, viewChild } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { Subject, takeUntil } from 'rxjs';

import { SimplebarAngularModule } from 'simplebar-angular';

import { UserExtended } from '@features/clients/types';
import { TableEvents, TableEvent } from '@features/clients/components/table';


@Component({
    selector: 'app-clients-table',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatTableModule,
        MatCheckboxModule,
        SimplebarAngularModule,
        MatSortModule
    ],
    templateUrl: './clients.table.component.html',
    styleUrl: './clients.table.component.scss'
})
export class ClientsTableComponent {

    @Input() set tableData(data: UserExtended[]  | null) {
        this.dataSource.data = data || [];

        if (this.selection.hasValue()) {
            this.selection.clear();
        }
    }

    @Output() appTableEvent = new EventEmitter<TableEvent>();

    protected options = {
        autoHide: false,
        forceVisible: true,
        scrollbarMaxSize: 250
    };

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
    protected sort = viewChild(MatSort);

    private _destroy$ = new Subject<void>();

    ngOnInit() {
        this.selection.changed.pipe(
            takeUntil(this._destroy$)
        ).subscribe(() => {
            this._makeEvent(TableEvents.SELECTION, this.selection.selected);
        })
    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }

    ngAfterViewInit() {
        queueMicrotask(() => {
            if (this.sort()) {
                this.dataSource.sort = this.sort()!;
            }
        });
    }

    protected isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    protected toggleAllRows() {
        if (this.isAllSelected()) {
          this.selection.clear();
          return;
        }
    
        this.selection.select(...this.dataSource.data);
    }

    protected onItemClick(event: any, row: UserExtended) {
        event.stopPropagation();
        this._makeEvent(TableEvents.ROW_ACTION, row['id']);
    }

    private _makeEvent(type: TableEvents, value?: any) {
        this.appTableEvent.emit({type: type, value: value});
    }

}