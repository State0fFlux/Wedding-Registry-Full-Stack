import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";

// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response; // only writing, so no need to check

// Side of the family
type Side = "Molly" | "James";

// Description of an individual guest
// RI: if plusOne = (false|undefined), then plusOneName = undefined and plusOneDiet = undefined
type Guest = {
	name: string;
	side: Side;
	family: boolean;
	diet?: string;
	plusOne?: boolean;
	plusOneName?: string;
	plusOneDiet?: string;
};

// Map from name to guest details.
const guests: Map<string, Guest> = new Map();

/** Testing function to remove all the added guests. */
export const resetForTesting = (): void => {
	guests.clear();
};

/**
 * Returns an alphabetically-sorted list of all the guests
 * @param _req the request
 * @param res the response
 */
export const listGuests = (_req: SafeRequest, res: SafeResponse): void => {
	const guestsArray = Array.from(guests.values()).sort((a, b) => a.name.localeCompare(b.name)); // sorts the list of guests
	res.send({ guests: guestsArray });
};

/**
 * Adds the guest to the end of the registry
 * expects a name, side, and family input in the body of the request
 * responds with a 400 status code if any inputs are missing or of invalid types,
 * or if the guest is already in the registry
 * @param req the request
 * @param res the response
 */
export const saveGuest = (req: SafeRequest, res: SafeResponse): void => {
	const name = req.body.name;
	if (typeof name !== "string") {
		res.status(400).send("missing 'name' parameter");
		return;
	}

	const side = req.body.side;
	if (typeof side !== "string") {
		res.status(400).send("missing 'side' parameter");
		return;
	}
	if (side !== "Molly" && side !== "James") {
		res.status(400).send(
			`side parameter was not expected value. side: '${side}'. expected: 'Molly' | 'James'.`
		);
		return;
	}

	const family = req.body.family;
	if (typeof family !== "boolean") {
		res.status(400).send("missing 'family' parameter");
		return;
	}

	// makes sure there is no guest with this name already
	if (guests.has(name)) {
		res.status(400).send(`guest: '${name}' is already entered into the registry`);
		return;
	}

	const guest: Guest = {
		name: name,
		side: side,
		family: family,
	};
	guests.set(guest.name, guest);
	res.send({ guest: guest });
};

/**
 * Updates information about the guest
 * expects a name, side, and family input in the body of the request
 * responds with a 400 status code if any inputs are missing or of invalid types,
 * or if the guest list does not have a guest to update its value on
 * @param req the request
 * @param res the response
 */
export const updateGuest = (req: SafeRequest, res: SafeResponse): void => {
	const name = req.body.name;
	if (typeof name !== "string") {
		res.status(400).send("missing or invalid 'name' parameter");
		return;
	}

	const side = req.body.side;
	if (typeof side !== "string" || (side !== "Molly" && side !== "James")) {
		res.status(400).send("missing or invalid 'side' parameter");
		return;
	}

	const family = req.body.family;
	if (typeof family !== "boolean") {
		res.status(400).send("missing or invalid 'family' parameter");
		return;
	}

	const diet = req.body.diet;
	if (typeof diet !== "string" && diet !== undefined) {
		res.status(400).send("missing or invalid 'diet' parameter");
		return;
	}

	const plusOne = req.body.plusOne;
	if (typeof plusOne !== "boolean" && plusOne !== undefined) {
		res.status(400).send("missing or invalid 'plusOne' parameter");
		return;
	}

	const plusOneName = req.body.plusOneName;
	if (
		(typeof plusOneName !== "string" && plusOneName !== undefined) ||
		((plusOne === undefined || plusOne === false) && plusOneName !== undefined) ||
		(plusOne === true && plusOneName === undefined)
	) {
		res.status(400).send("missing or invalid 'plusOneName' parameter");
		return;
	}

	const plusOneDiet = req.body.plusOneDiet;
	if (
		(typeof plusOneDiet !== "string" && plusOneDiet !== undefined) ||
		((plusOne === undefined || plusOne === false) && plusOneDiet !== undefined)
	) {
		res.status(400).send("missing or invalid 'plusOneDiet' parameter");
		return;
	}

	const guest: Guest = {
		name: name,
		side: side,
		family: family,
		diet: diet,
		plusOne: plusOne,
		plusOneName: plusOneName,
		plusOneDiet: plusOneDiet,
	};

	if (!guests.delete(name)) {
		// removes old version of the guest from registry
		res.status(400).send(
			`guest: '${name}' must exist in the registry in order to update their information`
		);
		return;
	}

	guests.set(guest.name, guest); // adds new version of the guest to the registry
	res.send({ guest: guest }); // send the updated registry
};

/**
 * Finds the guest by name in the registry
 * expects a name input in the query of the request
 * responds with a 400 status code if the inputs is missing or of invalid type,
 * or if the guest could not be found in the registry
 * @param req the request
 * @param res the response
 */
export const loadGuest = (req: SafeRequest, res: SafeResponse): void => {
	const name = first(req.query.name);
	if (name === undefined) {
		res.status(400).send("missing 'name' query parameter");
		return;
	}
	const guest = guests.get(name);
	if (guest === undefined) {
		res.status(400).send(`no guest with name '${name}'`);
		return;
	}
	res.send({ guest: guest }); // sends back the requested guest
};

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string | undefined => {
	if (Array.isArray(param)) {
		return first(param[0]);
	} else if (typeof param === "string") {
		return param;
	} else {
		return undefined;
	}
};
