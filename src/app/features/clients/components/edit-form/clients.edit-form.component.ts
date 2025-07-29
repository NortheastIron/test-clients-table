import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ClientsService } from '@features/clients/services';
import { User, UserExtended } from '@features/clients/types';

@Component({
    selector: 'app-clients-edit-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        ReactiveFormsModule
    ],
    templateUrl: './clients.edit-form.component.html',
    styleUrl: './clients.edit-form.component.scss'
})
export class ClientsEditFormComponent implements OnInit {
    
    protected data = inject<{id: string | undefined}>(MAT_DIALOG_DATA);
    private _clientsService = inject(ClientsService);
    private _dialogRef = inject(MatDialogRef<ClientsEditFormComponent>);

    protected name: FormControl;
    protected surname: FormControl;
    protected email: FormControl;
    protected phone: FormControl;

    protected form: FormGroup;
    protected minLenght: number = 2;

    constructor(_fb: FormBuilder) {
        this.name = _fb.control('', [Validators.required, Validators.minLength(this.minLenght)]);
        this.surname = _fb.control('', [Validators.required, Validators.minLength(this.minLenght)]);
        this.email = _fb.control('', [
            Validators.required,
            Validators.email
        ]);
        this.phone = _fb.control('', [
                this.phoneValidator.bind(this)
        ]);

        this.form = _fb.group({
            name: this.name,
            surname: this.surname,
            email: this.email,
            phone: this.phone
        });
    }

    ngOnInit() {
        if (this.data?.id) {
            this._loadData();
        }
    }

    protected onCloseClick(): void {
        this._dialogRef.close(false);
    }

    protected onSubmit() {
        if (this.form.invalid) {
            return;
        }

        this.form.disable();

        const formValue = this.form.value;
        const isEdit = !!this.data?.id;

        const clientData: Partial<UserExtended> = {
            name: formValue.name,
            surname: formValue.surname,
            email: formValue.email,
            phone: formValue.phone
        };

        if (isEdit) {
            clientData.id = this.data?.id;
        }

        const operation = isEdit
            ? this._clientsService.update(clientData as UserExtended)
            : this._clientsService.add(clientData as User);

        operation.subscribe({
            next: () => this._dialogRef.close(true),
            error: (err) => {
                console.error(err);
            }
        });
    }

    private _loadData() {
        this.form.disable();

        this._clientsService.get(this.data.id!).subscribe({
            next: (client: UserExtended | undefined) => {
                if (client) {
                    this.form.patchValue({
                        name: client.name,
                        surname: client.surname,
                        email: client.email,
                        phone: client.phone
                    });
                }
                
                this.form.enable();
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    private phoneValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        
        if (!value) {
            return null;
        }

        const isValid = /^\+7\d{10}$/.test(value);
        return isValid ? null : {'phone': true};
    }
}