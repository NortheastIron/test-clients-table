import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-page-header',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './page-header.component.html',
    styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {

    @Input() appTitle: string = 'Page';
}