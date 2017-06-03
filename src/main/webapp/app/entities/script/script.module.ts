import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ItgmSharedModule } from '../../shared';
import {
    ScriptService,
    ScriptPopupService,
    ScriptComponent,
    ScriptDetailComponent,
    ScriptDialogComponent,
    ScriptPopupComponent,
    ScriptDeletePopupComponent,
    ScriptDeleteDialogComponent,
    scriptRoute,
    scriptPopupRoute,
    ScriptResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...scriptRoute,
    ...scriptPopupRoute,
];

@NgModule({
    imports: [
        ItgmSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        ScriptComponent,
        ScriptDetailComponent,
        ScriptDialogComponent,
        ScriptDeleteDialogComponent,
        ScriptPopupComponent,
        ScriptDeletePopupComponent,
    ],
    entryComponents: [
        ScriptComponent,
        ScriptDialogComponent,
        ScriptPopupComponent,
        ScriptDeleteDialogComponent,
        ScriptDeletePopupComponent,
    ],
    providers: [
        ScriptService,
        ScriptPopupService,
        ScriptResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ItgmScriptModule {}
