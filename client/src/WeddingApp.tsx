import React, { Component } from "react";
import { GuestList } from "./GuestList";
import { NewGuest } from "./NewGuest";
import { GuestDetails } from "./GuestDetails";

type Page = "list" | "new" | { kind: "details"; name: string }; // types of pages available to display

type WeddingAppState = { page: Page }; // the current page being displayed

/** Displays the UI of the Wedding rsvp application. */
export class WeddingApp extends Component<{}, WeddingAppState> {
	constructor(props: {}) {
		super(props);
		this.state = { page: "list" };
	}

	// Renders the current page
	render = (): JSX.Element => {
		if (this.state.page === "list") {
			return <GuestList onGuestClick={this.doGuestClick} onNewClick={this.doNewClick} />;
		} else if (this.state.page === "new") {
			return <NewGuest onBackClick={this.doBackClick} />;
		} // details page
		else return <GuestDetails name={this.state.page.name} onBackClick={this.doBackClick} />;
	};

	// Switches to "New Guest" view
	doNewClick = (): void => {
		this.setState({ page: "new" });
	};

	// Switches to "Guest Details" view
	doGuestClick = (name: string): void => {
		this.setState({ page: { kind: "details", name: name } });
	};

	// Switches back to "Guest List" view
	doBackClick = (): void => {
		this.setState({ page: "list" });
	};
}
