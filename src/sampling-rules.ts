import * as fs from 'fs';

export interface ISamplingRules {
	rules: ISamplingRule[];
	'default': {
		fixedTarget: number;
		fallbackRate: number;
	};
}

export interface ISamplingRule {
	segmentNameMatch: string;
	fixedTarget: number;
	fallbackRate: number;
	force?: boolean;
}

export class SamplingRules {

	private _rules: ISamplingRule[];

	private _fixedTarget: number;

	private _fallbackRate: number;

	private _force: boolean;

	constructor () {

		this._rules = [];
		this._fixedTarget = 0;
		this._fallbackRate = 0.05;
		this._force = false;

	}

	public setSamplingRules (source: string): void {

		const config = JSON.parse(fs.readFileSync(source, 'utf8'));

		this._rules = config.rules;

		if (config.default) {

			this._fixedTarget = config.default.fixedTarget;
			this._fallbackRate = config.default.fallbackRate;
			this._force = config.default.force;

		}

	}

	public getSamplingRule (segmentName: string): ISamplingRule {

		const rule = this._rules.find((f) => segmentName.match(new RegExp(f.segmentNameMatch, 'ig')) !== null);

		if (rule) {

			return rule;

		}

		return {
			segmentNameMatch: 'default',
			fixedTarget: this._fixedTarget,
			fallbackRate: this._fallbackRate,
			force: this._force
		};

	}

}

export default new SamplingRules();
