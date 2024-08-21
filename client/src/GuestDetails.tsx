import React, { ChangeEvent, Component } from "react";
import { Guest, parseGuest } from "./guest";
import { isRecord } from "./record";

type DetailsProps = {
	name: string;
	onBackClick: () => void;
};

type DetailsState = {
	guest?: Guest; // the current guest whose details are being edited (undefined = loading screen)
	diet: string; // diet currently in text box
	plusOne?: boolean; // whether or not the guest has a plus one (undefined = unsure)
	plusOneName?: string; // the plus one name currently in text box (undefined = no confirmed plus one)
	plusOneDiet?: string; // the plus one dietary destrictions currently in text box (undefined = no confirmed plus one)
};

// Shows an individual guest's details and allows for the editing of such details
export class GuestDetails extends Component<DetailsProps, DetailsState> {
	constructor(props: DetailsProps) {
		super(props);
		this.state = {
			guest: undefined,
			diet: "",
			plusOne: undefined,
			plusOneName: undefined,
			plusOneDiet: undefined,
		};
	}

	// fetches the specific guest from the server
	componentDidMount = (): void => {
		fetch("/api/load?name=" + encodeURIComponent(this.props.name))
			.then(this.doLoadResp)
			.catch(() => this.doLoadError("failed to connect to server"));
	};

	// renders the page in its current state
	render = (): JSX.Element => {
		if (this.state.guest === undefined) {
			// loading screen
			return (
				<div>
					<h2>Loading . . .</h2>
					<br></br>
					<button type="button" onClick={this.doBackClick}>
						Back
					</button>
				</div>
			);
		} else {
			return (
				<div>
					<h2>Guest Details</h2>
					<p>
						{this.state.guest.name}, guest of {this.state.guest.side}
						{this.state.guest.family ? ", family" : ""}
					</p>
					<br></br>
					<div>
						<label htmlFor="diet">Dietary Restrictions: (Specify 'none' if none)</label>
						<br></br>
						<input
							id="diet"
							type="text"
							value={this.state.diet}
							onChange={this.doDietChange}
						></input>
					</div>
					<br></br>
					<br></br>
					<label htmlFor="plusOne">Additional Guest? </label>
					<select
						name="plusOne"
						id="plusOne"
						onChange={this.doPlusOneChange}
						defaultValue={
							this.state.guest.plusOne === undefined
								? "unknown"
								: this.state.guest.plusOne === false
								? "zero"
								: "one"
						}
					>
						<option value="unknown">Unknown</option>
						<option value="zero">0</option>
						<option value="one">1</option>
					</select>
					{this.state.plusOne === true ? this.renderPlusOne() : <p></p>}
					<br></br>
					<br></br>
					<button type="button" onClick={this.doUpdateClick}>
						Update
					</button>
					<button type="button" onClick={this.doBackClick}>
						Back
					</button>
				</div>
			);
		}
	};

	// renders the form for filling out info for a guest's plus one
	renderPlusOne = (): JSX.Element => {
		return (
			<div>
				<br></br>
				<label htmlFor="plusOneName">Guest Name: </label>
				<input
					id="plusOneName"
					type="text"
					value={this.state.plusOneName === undefined ? "" : this.state.plusOneName}
					onChange={this.doPlusOneNameChange}
				></input>
				<br></br>
				<br></br>
				<label htmlFor="plusOneDiet">
					Guest Dietary Restrictions: (Specify 'none' if none)
				</label>
				<br></br>
				<input
					id="plusOneDiet"
					type="text"
					value={this.state.plusOneDiet === undefined ? "" : this.state.plusOneDiet}
					onChange={this.doPlusOneDietChange}
				></input>
			</div>
		);
	};

	// reflects any changes in the 'dietary restrictions' text box in the state
	doDietChange = (evt: ChangeEvent<HTMLInputElement>): void => {
		this.setState({ diet: evt.target.value });
	};

	// reflects any changes in the 'plus one' selector box in the state
	doPlusOneChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
		const option: string = evt.target.selectedOptions[0].value;
		if (option === "unknown") {
			this.setState({ plusOne: undefined, plusOneName: undefined, plusOneDiet: undefined });
		} else if (option === "zero") {
			this.setState({ plusOne: false, plusOneName: undefined, plusOneDiet: undefined });
		} else if (option === "one") {
			this.setState({ plusOne: true });
		} else {
			// not possible based off of select options
			throw new Error("Select either 'Unknown', '1', or '0'");
		}
	};

	// reflects any changes in the 'plus one's name' text box in the state
	doPlusOneNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
		this.setState({ plusOneName: evt.target.value });
	};

	// reflects any changes in the 'plus one's dietary restrictions' text box in the state
	doPlusOneDietChange = (evt: ChangeEvent<HTMLInputElement>): void => {
		this.setState({ plusOneDiet: evt.target.value });
	};

	// called after the server responds to load get request
	doLoadResp = (res: Response): void => {
		if (res.status === 200) {
			res.json()
				.then(this.doLoadJson)
				.catch(() => this.doLoadError("200 res is not JSON"));
		} else if (res.status === 400) {
			res.text()
				.then(this.doLoadError)
				.catch(() => this.doLoadError("400 response is not text"));
		} else {
			this.doLoadError(`bad status code from /api/load: ${res.status}`);
		}
	};

	// called when the server load get request is successful
	doLoadJson = (data: unknown): void => {
		if (!isRecord(data)) {
			console.error("bad data from /api/load: not a record", data);
			return;
		}

		const guest = parseGuest(data.guest);
		if (guest !== undefined) {
			this.setState({
				guest: guest,
				diet: guest.diet === undefined ? "" : guest.diet,
				plusOne: guest.plusOne,
				plusOneName: guest.plusOneName,
				plusOneDiet: guest.plusOneDiet,
			});
		} else {
			console.error("guest from /api/load did not parse", data.guest);
		}
	};

	// called if the server load get request is unsuccessful
	doLoadError = (msg: string): void => {
		console.error(`Error fetching /api/load: ${msg}`);
	};

	// sends a post request to the server to update the guest into the guest list
	doUpdateClick = (): void => {
		// checking validity of new guest information
		if (this.state.guest === undefined) {
			// impossible
			alert("Please wait for the current guest to load in");
		} else if (this.state.diet !== undefined && this.state.diet.trim() === "") {
			alert("Please provide your dietary restrictions (enter 'none' if not applicable)");
		} else if (
			this.state.plusOne === true &&
			(this.state.plusOneName === undefined || this.state.plusOneName.trim() === "")
		) {
			alert("Please provide a name for the additional guest");
		} else if (
			this.state.plusOne === true &&
			this.state.plusOneDiet !== undefined &&
			this.state.plusOneDiet.trim() === ""
		) {
			alert(
				"Please provide any dietary restrictions for the additional guest (enter 'none' if not applicable)"
			);
		} else {
			const newState: Guest = {
				name: this.state.guest.name,
				side: this.state.guest.side,
				family: this.state.guest.family,
				diet: this.state.diet === "none" ? undefined : this.state.diet,
				plusOne: this.state.plusOne,
				plusOneName: this.state.plusOneName,
				plusOneDiet: this.state.plusOneDiet === "none" ? undefined : this.state.plusOneDiet,
			};
			fetch("api/update", {
				method: "POST",
				body: JSON.stringify(newState),
				headers: { "Content-Type": "application/json" },
			})
				.then(this.doUpdateResp)
				.catch(() => this.doUpdateError("failed to connect to server"));
		}
	};

	// called after the server responds to update post request
	doUpdateResp = (res: Response): void => {
		if (res.status === 200) {
			res.json()
				.then(this.doUpdateJson)
				.catch(() => this.doUpdateError("200 response is not JSON"));
		} else if (res.status === 400) {
			res.text()
				.then(this.doUpdateError)
				.catch(() => this.doUpdateError("400 response is not text"));
		} else {
			this.doUpdateError(`bad status code from /api/update: ${res.status}`);
		}
	};

	// called when the server update post request is successful
	doUpdateJson = (data: unknown): void => {
		if (!isRecord(data)) {
			console.error("bad data from /api/update: not a record", data);
			return;
		}
		this.props.onBackClick();
	};

	// called if the server update post request is unsuccessful
	doUpdateError = (msg: string): void => {
		console.error(`Error fetching /api/update: ${msg}`);
	};

	// Switches to the "Guest List" view
	doBackClick = (): void => {
		this.props.onBackClick();
	};
}
