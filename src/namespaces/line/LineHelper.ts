// SPDX-License-Identifier: AGPL-3.0-only

import { Series } from '../../Series';
import { LineObject } from './LineObject';

function toScalar(value: any) {
    if (value instanceof Series) return value.get(0);
    if (Array.isArray(value)) return value.length ? value[value.length - 1] : NaN;
    return value;
}

function toFiniteNumber(value: any, fallback = NaN) {
    const numeric = Number(toScalar(value));
    return Number.isFinite(numeric) ? numeric : fallback;
}

export class LineHelper {
    private _lines: LineObject[] = [];
    private _placeholderCache = new Map<string, LineObject>();

    constructor(private context: any) {}

    param(source: any, index: number = 0, _name?: string) {
        return Series.from(source).get(index);
    }

    new(x1: any, y1: any, x2: any, y2: any, options: any = {}): LineObject {
        const rawOptions = options && typeof options === 'object' ? options : {};
        const scalarOptions = Object.fromEntries(
            Object.entries(rawOptions).map(([key, value]) => [key, toScalar(value)])
        );

        const x1Number = toFiniteNumber(x1);
        const y1Number = toFiniteNumber(y1);
        const x2Number = toFiniteNumber(x2);
        const y2Number = toFiniteNumber(y2);
        const placeholderKey = JSON.stringify({
            x1: Number.isFinite(x1Number) ? x1Number : 'na',
            y1: Number.isFinite(y1Number) ? y1Number : 'na',
            x2: Number.isFinite(x2Number) ? x2Number : 'na',
            y2: Number.isFinite(y2Number) ? y2Number : 'na',
            color: String(scalarOptions?.color || ''),
            style: String(scalarOptions?.style || ''),
            width: Number.isFinite(Number(scalarOptions?.width)) ? Number(scalarOptions.width) : 1,
            extend: String(scalarOptions?.extend || ''),
        });
        const isPlaceholder =
            !Number.isFinite(x1Number) &&
            !Number.isFinite(y1Number) &&
            !Number.isFinite(x2Number) &&
            !Number.isFinite(y2Number);
        if (isPlaceholder && this._placeholderCache.has(placeholderKey)) {
            return this._placeholderCache.get(placeholderKey);
        }

        const line = new LineObject(x1Number, y1Number, x2Number, y2Number, scalarOptions);

        this._lines.push(line);
        if (!Array.isArray(this.context.lines)) {
            this.context.lines = [];
        }
        this.context.lines.push(line);
        if (isPlaceholder) {
            this._placeholderCache.set(placeholderKey, line);
        }
        return line;
    }

    delete(line: LineObject): void {
        if (line) {
            line._deleted = true;
        }
    }

    get all(): LineObject[] {
        return this._lines.filter((line) => !line._deleted);
    }

    get style_solid() {
        return 'style_solid';
    }
    get style_dotted() {
        return 'style_dotted';
    }
    get style_dashed() {
        return 'style_dashed';
    }
}
