// SPDX-License-Identifier: AGPL-3.0-only

let _lineIdCounter = 0;

export function resetLineIdCounter() {
    _lineIdCounter = 0;
}

export class LineObject {
    public id: number;
    public x1: number;
    public y1: number;
    public x2: number;
    public y2: number;
    public color: string;
    public style: string;
    public width: number;
    public extend: string;
    public _deleted: boolean;

    constructor(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options: {
            color?: string;
            style?: string;
            width?: number;
            extend?: string;
        } = {}
    ) {
        this.id = _lineIdCounter++;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.color = String(options.color || '');
        this.style = String(options.style || 'style_solid');
        this.width = Number.isFinite(Number(options.width)) ? Number(options.width) : 1;
        this.extend = String(options.extend || 'none');
        this._deleted = false;
    }

    set_xy1(x: number, y: number): LineObject {
        this.x1 = Number(x);
        this.y1 = Number(y);
        return this;
    }

    set_xy2(x: number, y: number): LineObject {
        this.x2 = Number(x);
        this.y2 = Number(y);
        return this;
    }
}
