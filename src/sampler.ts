import samplingRules from './sampling-rules';

export class Sampler {

	private _thisSecond: number | undefined;

	private _usedThisSecond: number;

	constructor () {

		this._usedThisSecond = 0;

	}

	public isSampled (segmentName: string): boolean {

		const rule = samplingRules.getSamplingRule(segmentName);

		if (rule.force) {

			return true;

		}

		const now = Math.round(new Date().getTime() / 1000);

		if (now !== this._thisSecond) {

			this._usedThisSecond = 0;
			this._thisSecond = now;

		}

		if (this._usedThisSecond >= rule.fixedTarget) {

			return Math.random() < rule.fallbackRate;

		}

		this._usedThisSecond++;

		return true;

	}

}

export default new Sampler();
