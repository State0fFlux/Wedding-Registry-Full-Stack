import React, { Component, ChangeEvent, MouseEvent } from "react";
import { Side } from "./guest";
import { isRecord } from "./record";

type NewGuestProps = {
	onBackClick: () => void;
};

type NewGuestState = {
	name: string; // name currently in text box
	side?: Side; // side of wedding guest represents (bridge/groom)
	family: boolean; // guests relationship to bride/groom
};

// Allows the user to add a new guest to the registry
export class NewGuest extends Component<NewGuestProps, NewGuestState> {
	constructor(props: NewGuestProps) {
		super(props);
		this.state = { name: "", side: undefined, family: false };
	}

	// renders the page in its current state
	render = (): JSX.Element => {
		return (
			<div>
				<h2>Add Guest</h2>
				<div>
					<label htmlFor="name">Name: </label>
					<input
						id="name"
						type="text"
						value={this.state.name}
						onChange={this.doNameChange}
					></input>
				</div>
				<br></br>
				<label htmlFor="side">Guest of: </label>
				<br></br>
				<br></br>
				<input
					type="radio"
					id="molly"
					name="side"
					value="Molly"
					onClick={this.doMollyClick}
				></input>
				<label htmlFor="side"> Molly</label>

				<br></br>
				<input
					type="radio"
					id="james"
					name="side"
					value="James"
					onClick={this.doJamesClick}
				></input>
				<label htmlFor="side"> James</label>
				<br></br>
				<br></br>
				<input type="checkbox" id="family" onClick={this.doFamilyClick}></input>
				<label htmlFor="family"> Family</label>
				<br></br>
				<br></br>
				<button type="button" onClick={this.doSaveClick}>
					Save
				</button>
				<button type="button" onClick={this.props.onBackClick}>
					Back
				</button>
			</div>
		);
	};

	// reflects any changes in the name text box in the state
	doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
		this.setState({ name: evt.target.value });
	};

	// reflects changes in guest's side in the state (shift to Molly)
	doMollyClick = (_evt: MouseEvent<HTMLInputElement>): void => {
		this.setState({ side: "Molly" });
	};

	// reflects changes in guest's side in the state (shift to James)
	doJamesClick = (_evt: MouseEvent<HTMLInputElement>): void => {
		this.setState({ side: "James" });
	};

	// reflects changes in the guest's familial relationship in the state
	doFamilyClick = (): void => {
		this.setState({ family: !this.state.family });
	};

	// sends a post request to the server to save the guest list into the guest list
	doSaveClick = (_: MouseEvent<HTMLButtonElement>): void => {
		// checking validity of new guest information
		if (this.state.name.trim().length === 0) {
			alert("Please enter a name for the guest");
			return;
		} else if (this.state.side === undefined) {
			alert("Please specify whether you are coming on behalf of the bride or the groom");
			return;
		}

		const args = { name: this.state.name, side: this.state.side, family: this.state.family };
		fetch("api/save", {
			method: "POST",
			body: JSON.stringify(args),
			headers: { "Content-Type": "application/json" },
		})
			.then(this.doSaveResp)
			.catch(() => this.doSaveError("failed to connect to server"));
	};

	// called after the server responds to save post request
	doSaveResp = (resp: Response): void => {
		if (resp.status === 200) {
			resp.json()
				.then(this.doSaveJson)
				.catch(() => this.doSaveError("200 response is not JSON"));
		} else if (resp.status === 400) {
			resp.text()
				.then(this.doSaveError)
				.catch(() => this.doSaveError("400 response is not text"));
		} else {
			this.doSaveError(`bad status code from /api/save: ${resp.status}`);
		}
	};

	// called when the server save post request is successful
	doSaveJson = (data: unknown): void => {
		if (!isRecord(data)) {
			console.error("bad data from /api/save: not a record", data);
			return;
		}

		this.props.onBackClick(); // show the updated list
	};

	// called if the server save post request is unsuccessful
	doSaveError = (msg: string): void => {
		alert(msg);
	};
}
