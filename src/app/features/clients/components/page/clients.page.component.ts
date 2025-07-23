import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PageHeaderComponent } from '@shared';

@Component({
    selector: 'app-clients-page',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatButtonModule,
        MatIconModule,
        PageHeaderComponent
    ],
    templateUrl: './clients.page.component.html',
    styleUrl: './clients.page.component.scss',
})
export class ClientsPageComponent {

    protected pageTitle: string = 'Клиенты';
}