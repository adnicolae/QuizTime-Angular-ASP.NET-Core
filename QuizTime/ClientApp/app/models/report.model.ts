import { Group } from "./group.model";

export class Report {
    constructor(
        public group?: Group,
        public result?: number
    ) {}
}