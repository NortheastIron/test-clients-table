import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, catchError, defer, first, map, Observable, of, take, tap, throwError } from 'rxjs';

import { User, UserExtended } from '@features/clients/types';

@Injectable()
export class ClientsService {
    private _apiUrl = 'https://test-data.directorix.cloud/task1';
    private _clientsSubject$ = new BehaviorSubject<UserExtended[]>([]);

    private _http: HttpClient = inject(HttpClient);
    private _storageKey: string = 'clients_data';

    public get clients$(): Observable<UserExtended[]> {
        return this._clientsSubject$.asObservable();
    }

    public initLoad(): Observable<void> {

        return defer(() => {
            const storedData = localStorage.getItem(this._storageKey);
            if (storedData) {
                try {
                    const clients = JSON.parse(storedData) as UserExtended[];
                    if (clients.length) {
                        this._clientsSubject$.next(clients);
                        return of(undefined);
                    } else {
                        return this.loadData();
                    }
                } catch (err) {
                    console.error('Ошибка парсинга данных из localStorage: ', err);
                    localStorage.removeItem(this._storageKey);
                    return this.loadData();
                }
            } else {
                return this.loadData();
            }
        }).pipe(
            take(1)
        );
    }

    public loadData(): Observable<void> {
        return this._http.get<{users: User[]}>(this._apiUrl).pipe(
            catchError(err => {
                console.error('Ошибка загрузки данных: ', err);
                return of({ users: [] });
            }),
            map(response => {
                return response.users?.map(user => ({
                    ...user,
                    id: crypto.randomUUID()
                })) || [];
            }),
            tap((clients) => {
                this._clientsSubject$.next(clients);
                this.saveToLocalStorage(clients);
            }),
            map(() => undefined),
            take(1)
        );
    }

    public get(id: string): Observable<UserExtended | undefined> {
        return this._clientsSubject$.pipe(
            map(clients => clients.find(cl => cl.id === id)),
            first(),
            catchError(err => {
                return of(undefined);
            })
        );
    }

    public update(data: UserExtended): Observable<boolean> {
        const _clientsSubject$ = this._clientsSubject$;

        return defer(() => {
            const isInclude = _clientsSubject$.value.some(cl => cl.id === data.id);

            if (!isInclude) {
                return throwError(() => new Error('Id в списке не найден'));
            }
            return of(true).pipe(
                tap(() => {
                    const upList = _clientsSubject$.value.map(cl => {
                        if (cl.id === data.id) {
                            return data;
                        }
                        return cl;
                    });

                    _clientsSubject$.next(upList);
                    this.saveToLocalStorage(upList);
                })
            );
        }).pipe(
            take(1),
            catchError(err => {
                console.error('Ошибка при обновлении данных: ', err);
                return of(false)
            })
        );
    }

    public add(addClient: User): Observable<boolean> {
        const _clientsSubject$ = this._clientsSubject$;

        return of(true).pipe(
            tap(() => {
                const updatedList = [..._clientsSubject$.value, { ...addClient, id: crypto.randomUUID() }];
                this._clientsSubject$.next(updatedList);
                this.saveToLocalStorage(updatedList);
            }),
            take(1),
            catchError(err => {
                console.error('Ошибка добавления записи:  ', err);
                return of(false);
            })
        )
    }

    public remove(ids: string[]): Observable<boolean> {
        const _clientsSubject$ = this._clientsSubject$;

        return defer(() => {
            const currentClients = _clientsSubject$.value;
            const currentIds = new Set(currentClients.map(cl => cl.id));
            const isInclude = ids.every(id => currentIds.has(id));

            if (!isInclude) {
                return throwError(() => new Error('Id в списке не найден'));
            }

            return of(true).pipe(
                tap(() => {
                    const removeIdsSet = new Set(ids);
                    const updatedClients = _clientsSubject$.value.filter(cl => !removeIdsSet.has(cl.id));
                    _clientsSubject$.next(updatedClients);
                    this.saveToLocalStorage(updatedClients);
                })
            )
        }).pipe(
            take(1),
            catchError(err => {
                console.error('Ошибка удаления данных: ', err);
                return of(false);
            })
        );
    }

    private saveToLocalStorage(clients: UserExtended[]): void {
        localStorage.setItem(this._storageKey, JSON.stringify(clients));
    }
}