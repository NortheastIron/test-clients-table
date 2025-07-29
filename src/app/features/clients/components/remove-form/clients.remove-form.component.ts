import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-clients-remove-form',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './clients.remove-form.component.html',
    styleUrl: './clients.remove-form.component.scss'
})
export class ClientsRemoveFormComponent {
    protected data = inject<{qty: number}>(MAT_DIALOG_DATA);
}