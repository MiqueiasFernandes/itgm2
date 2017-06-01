import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ItgmSharedModule } from '../../shared';
import {
    TerminalService,
    TerminalPopupService,
    TerminalComponent,
    TerminalDetailComponent,
    TerminalDialogComponent,
    TerminalPopupComponent,
    TerminalDeletePopupComponent,
    TerminalDeleteDialogComponent,
    terminalRoute,
    terminalPopupRoute,
    TerminalResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...terminalRoute,
    ...terminalPopupRoute,
];

@NgModule({
    imports: [
        ItgmSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        TerminalComponent,
        TerminalDetailComponent,
        TerminalDialogComponent,
        TerminalDeleteDialogComponent,
        TerminalPopupComponent,
        TerminalDeletePopupComponent,
    ],
    entryComponents: [
        TerminalComponent,
        TerminalDialogComponent,
        TerminalPopupComponent,
        TerminalDeleteDialogComponent,
        TerminalDeletePopupComponent,
    ],
    providers: [
        TerminalService,
        TerminalPopupService,
        TerminalResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ItgmTerminalModule {}
