import { Cenario } from '../cenario';
export class Script {
    constructor(
        public id?: number,
        public nome?: string,
        public status?: number,
        public token?: string,
        public resultados?: string,
        public cenario?: Cenario,
    ) {
    }
}
