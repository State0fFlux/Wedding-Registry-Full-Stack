import React, { Component, MouseEvent } from "react";
import { Guest, GuestInfo, getGuestInfo, parseGuestArray } from "./guest";
import { isRecord } from "./record";

type ListProps = {
	onNewClick: () => void;
	onGuestClick: (name: string) => void;
};

type ListState = {
	guests?: ReadonlyArray<Guest>; // the current list of wedding guests (undefined = loading screen)
	mollyConfirmed: number; // the number of confirmed guests for Molly
	mollyFam: number; // the number of familial guests for Molly
	mollyPotential: number; // the number of potential guests for Molly
	jamesConfirmed: number; // the number of confirmed guests for James
	jamesFam: number; // the number of familial guests for Molly
	jamesPotential: number; // the number of potential guests for Molly
};

// Shows the current guest list
export class GuestList extends Component<ListProps, ListState> {
	constructor(props: ListProps) {
		super(props);
		this.state = {
			guests: undefined,
			mollyConfirmed: 0,
			mollyFam: 0,
			mollyPotential: 0,
			jamesConfirmed: 0,
			jamesFam: 0,
			jamesPotential: 0,
		};
	}

	// fetches the current guest list from the server
	componentDidMount = (): void => {
		fetch("/api/list")
			.then(this.doListResp)
			.catch(() => this.doListError("failed to connect to server"));
	};

	// renders the page in its current state
	render = (): JSX.Element => {
		if (this.state.guests === undefined) {
			return <h2>Loading . . .</h2>;
		} else {
			return (
				<div>
					<h2>Guest List</h2>
					<ul>{this.renderGuests()}</ul>
					<h3>Summary:</h3>
					<p>
						{this.state.mollyConfirmed}
						{this.state.mollyPotential > 0
							? `-${this.state.mollyConfirmed + this.state.mollyPotential}`
							: ""}{" "}
						guest(s) of Molly ({this.state.mollyFam} family)
					</p>
					<p>
						{this.state.jamesConfirmed}
						{this.state.jamesPotential > 0
							? `-${this.state.jamesConfirmed + this.state.jamesPotential}`
							: ""}{" "}
						guest(s) of James ({this.state.jamesFam} family)
					</p>
					<button type="button" onClick={this.doNewClick}>
						New Guest
					</button>
				</div>
			);
		}
	};

	// renders the list of guests
	renderGuests = (): JSX.Element[] => {
		return this.renderGuestsHelper(0);
	};

	// assists in rendering the list of guests, guest-by-guest
	renderGuestsHelper = (index: number): JSX.Element[] => {
		if (this.state.guests === undefined) {
			throw new Error("guest list lost while rendering"); // will never happen, function should only be called if guests is defined
		}
		if (index === this.state.guests.length) {
			return [];
		} else {
			const guest = this.state.guests[index];
			return [
				<li key={guest.name}>
					<a href="#" onClick={(evt) => this.doGuestClick(evt, guest.name)}>
						{guest.name}
					</a>
					: Guest of {guest.side}, +
					{guest.plusOne === undefined ? "1?" : guest.plusOne ? "1" : "0"}
				</li>,
			].concat(this.renderGuestsHelper(index + 1));
		}
	};

	// called after the server responds to list get request
	doListResp = (resp: Response): void => {
		if (resp.status === 200) {
			resp.json()
				.then(this.doListJson)
				.catch(() => this.doListError("200 response is not JSON"));
		} else if (resp.status === 400) {
			resp.text()
				.then(this.doListError)
				.catch(() => this.doListError("400 response is not text"));
		} else {
			this.doListError(`bad status code from /api/list: ${resp.status}`);
		}
	};

	// called when the server list get request is successful
	doListJson = (data: unknown): void => {
		if (!isRecord(data)) {
			console.error("bad data from /api/list: not a record", data);
			return;
		}

		if (!Array.isArray(data.guests)) {
			console.error("bad data from /api/list: guests is not an array", data);
			return;
		}

		const guests: ReadonlyArray<Guest> | undefined = parseGuestArray(data.guests);
		if (guests === undefined) {
			console.error("bad data from /api/list: guests contains non-guest values", data);
			return;
		}

		const info: GuestInfo = getGuestInfo(guests);
		this.setState({
			guests: guests,
			mollyConfirmed: info.mollyConfirmed,
			mollyFam: info.mollyFam,
			mollyPotential: info.mollyPotential,
			jamesConfirmed: info.jamesConfirmed,
			jamesFam: info.jamesFam,
			jamesPotential: info.jamesPotential,
		});
	};

	// called if the server list get request is unsuccessful
	doListError = (msg: string): void => {
		console.error(`Error fetching /api/list: ${msg}`);
	};

	// Switches to the "New Guest" view
	doNewClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
		this.props.onNewClick();
	};

	// Switches to the "Guest Details" view
	doGuestClick = (evt: MouseEvent<HTMLAnchorElement>, name: string): void => {
		evt.preventDefault();
		this.props.onGuestClick(name);
	};
}
