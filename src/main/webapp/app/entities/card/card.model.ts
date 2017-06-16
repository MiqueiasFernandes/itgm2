import { Customize } from '../customize';
export class Card {
    constructor(
        public id?: number,
        public nome?: string,
        public url?: string,
        public meta?: string,
        public disposicao?: string,
        public tipo?: number,
        public modo?: string,
        public customize?: Customize,
    ) {
    }
}
