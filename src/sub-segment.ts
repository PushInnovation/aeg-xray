import SegmentBase from './segment-base';
import Segment from './segment';
import segmentEmitter from './segment-emitter';

export default class SubSegment extends SegmentBase {

	private _parent: Segment;

	constructor (name: string, parent: Segment) {

		super(name, 'subsegment', parent.subSegmentSampler.isSampled(name));

		this._traceId = parent.traceId;
		this._parent = parent;

	}

	public json (): any {

		const message = super.json();
		message.parent_id = this._parent.id;
		message.type = this._type;
		return message;

	}

	public async flush (): Promise<void> {

		// although this would be a code bug, if the parent was already closed, emit this
		if (this._parent.closed && this._isSampled) {

			await segmentEmitter.send(this);

		}

	}

}
