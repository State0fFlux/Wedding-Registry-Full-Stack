import { isRecord } from "./record";

// Description of an individual guest
// RI: if plusOne = (false|undefined), then plusOneName = undefined and plusOneDiet = undefined
export type Guest = {
	readonly name: string;
	readonly side: Side;
	readonly family: boolean;
	readonly diet?: string;
	readonly plusOne?: boolean;
	readonly plusOneName?: string;
	readonly plusOneDiet?: string;
};

// Side of the family
export type Side = "Molly" | "James";

// Information about guests on the guest list
export type GuestInfo = {
	readonly mollyConfirmed: number;
	readonly mollyFam: number;
	readonly mollyPotential: number;
	readonly jamesConfirmed: number;
	readonly jamesFam: number;
	readonly jamesPotential: number;
};

/**
 * Searches through a list of wedding guests, and returns statistics about guest demographics
 * @param guests a list of wedding guests for James and Molly's wedding
 * @returns a record of statistical information about the guests:
 *  - mollyConfirmed: the number of confirmed guests on Molly's behalf
 *  - mollyFam: the number of confirmed guests on Molly's behalf that are also familially related to Molly
 *  - mollyPotential: the number of potential guests on Molly's behalf
 *  - jamesConfirmed: the number of confirmed guests on James's behalf
 *  - jamesFam: the number of confirmed guests on James's behalf that are also familially related to James
 *  - jamesPotential: the number of potential guests on James's behalf
 */
export const getGuestInfo = (guests: ReadonlyArray<Guest>): GuestInfo => {
	if (guests.length === 0) {
		return {
			mollyConfirmed: 0,
			mollyFam: 0,
			mollyPotential: 0,
			jamesConfirmed: 0,
			jamesFam: 0,
			jamesPotential: 0,
		};
	} else {
		const guest = guests[0];
		const restInfo = getGuestInfo(guests.slice(1));
		return {
			mollyConfirmed:
				(guest.side === "Molly" ? (guest.plusOne === true ? 2 : 1) : 0) +
				restInfo.mollyConfirmed,
			mollyFam: (guest.side === "Molly" && guest.family ? 1 : 0) + restInfo.mollyFam,
			mollyPotential:
				(guest.side === "Molly" && guest.plusOne === undefined ? 1 : 0) +
				restInfo.mollyPotential,
			jamesConfirmed:
				(guest.side === "James" ? (guest.plusOne === true ? 2 : 1) : 0) +
				restInfo.jamesConfirmed,
			jamesFam: (guest.side === "James" && guest.family ? 1 : 0) + restInfo.jamesFam,
			jamesPotential:
				(guest.side === "James" && guest.plusOne === undefined ? 1 : 0) +
				restInfo.jamesPotential,
		};
	}
};

/**
 * Parses unknown data into an Guest
 * @param val unknown data to parse into a Guest
 * @return a Guest parsed from given data, or undefined if the unknown value could not be parsed into a Guest
 */
export const parseGuest = (val: unknown): undefined | Guest => {
	if (!isRecord(val)) {
		console.error("not a guest", val);
		return undefined;
	}

	if (typeof val.name !== "string") {
		console.error("not a guest: missing or invalid 'name'", val.name);
		return undefined;
	}

	if (typeof val.side !== "string" || (val.side !== "James" && val.side !== "Molly")) {
		console.error("not a guest: missing or invalid 'side'", val.side);
		return undefined;
	}

	if (typeof val.family !== "boolean") {
		console.error("not a guest: missing or invalid 'family'", val.family);
		return undefined;
	}

	if (typeof val.diet !== "string" && val.diet !== undefined) {
		console.error("not a guest: missing or invalid 'diet'", val.diet);
		return undefined;
	}

	if (typeof val.plusOne !== "boolean" && val.plusOne !== undefined) {
		console.error("not a guest: missing or invalid 'plusOne'", val.plusOne);
		return undefined;
	}

	if (
		(typeof val.plusOneName !== "string" && val.plusOneName !== undefined) ||
		((val.plusOne === undefined || val.plusOne === false) && val.plusOneName !== undefined) ||
		(val.plusOne === true && val.plusOneName === undefined)
	) {
		console.error("not a guest: missing or invalid 'plusOneName'", val.plusOneName);
		return undefined;
	}

	if (
		(typeof val.plusOneDiet !== "string" && val.plusOneDiet !== undefined) ||
		((val.plusOne === undefined || val.plusOne === false) && val.plusOneDiet !== undefined)
	) {
		console.error("not a guest: missing or invalid 'plusOneDiet'", val.plusOneDiet);
		return undefined;
	}

	return {
		name: val.name,
		side: val.side,
		family: val.family,
		diet: val.diet,
		plusOne: val.plusOne,
		plusOneName: val.plusOneName,
		plusOneDiet: val.plusOneDiet,
	};
};

/**
 * Parses an array of unknown values into an array of Guests
 * @param vals array of unknown values to parse into Guests
 * @returns an array of Guests parsed from given array of data, or undefined if any of the unknown values could not be parsed into a Guest
 */
export const parseGuestArray = (vals: ReadonlyArray<unknown>): undefined | ReadonlyArray<Guest> => {
	if (vals.length === 0) {
		return [];
	}
	const guest = parseGuest(vals[0]);
	if (guest === undefined) {
		return undefined;
	}
	const rest = parseGuestArray(vals.slice(1));
	if (rest === undefined) {
		return undefined;
	}
	return [guest].concat(rest);
};
