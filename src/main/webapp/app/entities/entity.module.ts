import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ItgmProjetoModule } from './projeto/projeto.module';
import { ItgmModeloModule } from './modelo/modelo.module';
import { ItgmCenarioModule } from './cenario/cenario.module';
import { ItgmBaseModule } from './base/base.module';
import { ItgmCompartilharModule } from './compartilhar/compartilhar.module';
import { ItgmModeloExclusivoModule } from './modelo-exclusivo/modelo-exclusivo.module';
import { ItgmCustomizeModule } from './customize/customize.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        ItgmProjetoModule,
        ItgmModeloModule,
        ItgmCenarioModule,
        ItgmBaseModule,
        ItgmCompartilharModule,
        ItgmModeloExclusivoModule,
        ItgmCustomizeModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ItgmEntityModule {}
