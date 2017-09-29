export default class SegmentSqlData {

	private _user: string;

	private _url: string;

	private _query: string | undefined;

	constructor (user, url, options: { query?: string } = {}) {

		this._user = user;
		this._url = url;
		this._query = options.query;

	}

	public json (): any {

		const message: any = {
			user: this._user,
			url: this._url
		};

		if (this._query) {

			message.sanitized_query = this._query;

		}

		return message;

	}

}
