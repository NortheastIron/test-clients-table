import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, distinctUntilChanged, finalize, map, Observable } from 'rxjs';

import { PageHeaderComponent } from '@shared';

import { UserExtended } from '@features/clients/types';
import { ClientsTableComponent, TableEvent, TableEvents } from '@features/clients/components/table';
import { ClientsService } from '@features/clients/services';
import { ClientsEditFormComponent } from '@features/clients/components/edit-form';
import { ClientsRemoveFormComponent } from '@features/clients/components/remove-form';

@Component({
    selector: 'app-clients-page',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatButtonModule,
        MatIconModule,
        PageHeaderComponent,
        AsyncPipe,
        ClientsTableComponent
    ],
    templateUrl: './clients.page.component.html',
    styleUrl: './clients.page.component.scss',
    providers: [ClientsService]
})
export class ClientsPageComponent {

    private _clientsService = inject(ClientsService);
    private _dialog = inject(MatDialog);

    protected pageTitle: string = 'Клиенты';
    
    protected dataSource = this._clientsService.clients$;

    private _isLoading$ = new BehaviorSubject<boolean>(false);
    private _selectionItems$ = new BehaviorSubject<UserExtended[]>([]);
    private _injector = inject(Injector);

    ngOnInit() {
        this._isLoading$.next(true);
        this._clientsService.initLoad().pipe(
            finalize(() => {
                this._isLoading$.next(false);
            })
        ).subscribe();
    }

    protected onTableEvent(event: TableEvent): void {
        switch(event.type) {
            case TableEvents.SELECTION:
                this._selectionItems$.next(event.value);
                break;
            case TableEvents.ROW_ACTION:
                if (event.value) {
                    this.editClient(event.value);
                }
                break;
        }
    }

    protected editClient(id?: string): void {
        const dialogRef = this._dialog.open(ClientsEditFormComponent, {
            autoFocus: false,
            data: {id: id},
            injector: this._injector
        });

        dialogRef.afterClosed().subscribe();
    }

    protected removeDialog(): void {
        const removeIds = this._selectionItems$.value.map(item => item.id);
        
        const dialogRef = this._dialog.open(ClientsRemoveFormComponent, {
            data: {qty: removeIds.length}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._removeClients(removeIds);
            }
        });
    }

    protected get isLoading$(): Observable<boolean> {
        return this._isLoading$.asObservable();
    }

    protected get selectionItems$(): Observable<UserExtended[]> {
        return this._selectionItems$.asObservable();
    }

    protected get isRemoveValid$(): Observable<boolean> {
        return combineLatest([
            this.isLoading$,
            this.selectionItems$
        ]).pipe(
            map(([isLoad, selections]) => {
                return !isLoad && selections.length > 0
            }),
            distinctUntilChanged()
        );
    }

    private _removeClients(ids: string[]): void {
        this._isLoading$.next(true);
        this._clientsService.remove(ids).pipe(
            finalize(() => {
                this._isLoading$.next(false);
            })
        ).subscribe(result => {
            if (result) {
                this._selectionItems$.next([]);
            } else {
                console.error('Ошибка удаления');
            }
        });
    }
}