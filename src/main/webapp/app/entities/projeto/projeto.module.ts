import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ItgmSharedModule } from '../../shared';
import { ItgmAdminModule } from '../../admin/admin.module';
import {
    ProjetoService,
    ProjetoPopupService,
    ProjetoComponent,
    ProjetoDetailComponent,
    ProjetoDialogComponent,
    ProjetoPopupComponent,
    ProjetoDeletePopupComponent,
    ProjetoDeleteDialogComponent,
    projetoRoute,
    projetoPopupRoute,
    ProjetoResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...projetoRoute,
    ...projetoPopupRoute,
];

@NgModule({
    imports: [
        ItgmSharedModule,
        ItgmAdminModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        ProjetoComponent,
        ProjetoDetailComponent,
        ProjetoDialogComponent,
        ProjetoDeleteDialogComponent,
        ProjetoPopupComponent,
        ProjetoDeletePopupComponent,
    ],
    entryComponents: [
        ProjetoComponent,
        ProjetoDialogComponent,
        ProjetoPopupComponent,
        ProjetoDeleteDialogComponent,
        ProjetoDeletePopupComponent,
    ],
    providers: [
        ProjetoService,
        ProjetoPopupService,
        ProjetoResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ItgmProjetoModule {}
