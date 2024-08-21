import * as assert from "assert";
import { getGuestInfo, Guest, GuestInfo, parseGuest, parseGuestArray } from "./guest";

describe("guest", function () {
	it("getGuestInfo", function () {
		const guest1: Guest = {
			name: "Brady Manske",
			side: "Molly",
			family: false,
		};
		const guest2: Guest = {
			name: "Alice",
			side: "James",
			family: true,
			plusOne: true,
			plusOneName: "Cheshire Cat",
		};
		const guest3: Guest = {
			name: "Meemaw",
			side: "Molly",
			family: true,
			plusOne: true,
			plusOneName: "Peepaw",
			plusOneDiet: "no pickles please",
		};
		const guest4: Guest = {
			name: "Sam",
			side: "James",
			family: true,
			plusOne: undefined,
		};

		const info1: GuestInfo = {
			mollyConfirmed: 1,
			mollyFam: 0,
			mollyPotential: 1,
			jamesConfirmed: 0,
			jamesFam: 0,
			jamesPotential: 0,
		};
		const info2: GuestInfo = {
			mollyConfirmed: 0,
			mollyFam: 0,
			mollyPotential: 0,
			jamesConfirmed: 2,
			jamesFam: 1,
			jamesPotential: 0,
		};
		const info3: GuestInfo = {
			mollyConfirmed: 2,
			mollyFam: 1,
			mollyPotential: 0,
			jamesConfirmed: 0,
			jamesFam: 0,
			jamesPotential: 0,
		};
		const info4: GuestInfo = {
			mollyConfirmed: 0,
			mollyFam: 0,
			mollyPotential: 0,
			jamesConfirmed: 1,
			jamesFam: 1,
			jamesPotential: 1,
		};
		const info1x2: GuestInfo = {
			mollyConfirmed: 1,
			mollyFam: 0,
			mollyPotential: 1,
			jamesConfirmed: 2,
			jamesFam: 1,
			jamesPotential: 0,
		};
		const info3x4: GuestInfo = {
			mollyConfirmed: 2,
			mollyFam: 1,
			mollyPotential: 0,
			jamesConfirmed: 1,
			jamesFam: 1,
			jamesPotential: 1,
		};
		const info1x2x3x4: GuestInfo = {
			mollyConfirmed: 3,
			mollyFam: 1,
			mollyPotential: 1,
			jamesConfirmed: 3,
			jamesFam: 2,
			jamesPotential: 1,
		};

		// 0 recursive calls (1 input possible)
		assert.deepStrictEqual(getGuestInfo([]), {
			mollyConfirmed: 0,
			mollyFam: 0,
			mollyPotential: 0,
			jamesConfirmed: 0,
			jamesFam: 0,
			jamesPotential: 0,
		});

		// 1 recursive call (2 inputs)
		assert.deepStrictEqual(getGuestInfo([guest1]), info1);
		assert.deepStrictEqual(getGuestInfo([guest2]), info2);
		assert.deepStrictEqual(getGuestInfo([guest3]), info3);
		assert.deepStrictEqual(getGuestInfo([guest4]), info4);

		// many recrusive calls (2 inputs)
		assert.deepStrictEqual(getGuestInfo([guest1, guest2]), info1x2);
		assert.deepStrictEqual(getGuestInfo([guest3, guest4]), info3x4);
		assert.deepStrictEqual(getGuestInfo([guest1, guest2, guest3, guest4]), info1x2x3x4);
	});

	it("parseGuest", function () {
		// non-record parameter (2 inputs)
		assert.deepStrictEqual(parseGuest("hi"), undefined);
		assert.deepStrictEqual(parseGuest(17), undefined);

		// missing or invalid 'name' parameter (2 inputs)
		assert.deepStrictEqual(parseGuest({}), undefined);
		assert.deepStrictEqual(parseGuest({ name: 7 }), undefined);
		assert.deepStrictEqual(parseGuest({ name: false }), undefined);

		// missing or invalid 'side' parameter (2 inputs)
		assert.deepStrictEqual(parseGuest({ name: "Alice" }), undefined);
		assert.deepStrictEqual(parseGuest({ name: "Barry", side: "WOOHOO" }), undefined);
		assert.deepStrictEqual(parseGuest({ name: "Travis", side: false }), undefined);

		// missing or invalid 'family' parameter (2 inputs)
		assert.deepStrictEqual(
			parseGuest({ name: "Alice", side: "Molly", family: "YEAAA" }),
			undefined
		);
		assert.deepStrictEqual(parseGuest({ name: "Barry", side: "James" }), undefined);
		assert.deepStrictEqual(
			parseGuest({ name: "Travis", side: "James", family: undefined }),
			undefined
		);

		// invalid 'diet' parameter (2 inputs)
		assert.deepStrictEqual(
			parseGuest({ name: "Alice", side: "Molly", family: true, diet: 17 }),
			undefined
		);
		assert.deepStrictEqual(
			parseGuest({ name: "Barry", side: "James", family: false, diet: true }),
			undefined
		);
		assert.deepStrictEqual(
			parseGuest({ name: "Travis", side: "James", family: false, diet: { diet: "diet" } }),
			undefined
		);

		// invalid 'plus one' parameter (2 inputs)
		assert.deepStrictEqual(
			parseGuest({
				name: "Alice",
				side: "Molly",
				family: true,
				diet: "pickles",
				plusOne: 16,
			}),
			undefined
		);
		assert.deepStrictEqual(
			parseGuest({ name: "Barry", side: "James", family: false, plusOne: "yep!" }),
			undefined
		);
		assert.deepStrictEqual(
			parseGuest({
				name: "Travis",
				side: "James",
				family: false,
				diet: "I like food!",
				plusOne: { plusOne: true },
			}),
			undefined
		);

		// missing or invalid 'plus one's name' parameter (2 inputs)
		assert.deepStrictEqual(
			parseGuest({
				name: "Alice",
				side: "Molly",
				family: true,
				diet: "pickles",
				plusOne: true,
			}),
			undefined
		);
		assert.deepStrictEqual(
			parseGuest({
				name: "Barry",
				side: "James",
				family: false,
				plusOne: false,
				plusOneName: "How did i get here?",
			}),
			undefined
		);
		assert.deepStrictEqual(
			parseGuest({
				name: "Travis",
				side: "James",
				family: false,
				diet: "I like food!",
				plusOne: true,
				plusOneName: false,
			}),
			undefined
		);

		// missing or invalid 'plus one's diet' parameter (2 inputs)
		assert.deepStrictEqual(
			parseGuest({
				name: "Alice",
				side: "Molly",
				family: true,
				diet: "pickles",
				plusOne: true,
				plusOneName: "Mad Hatter",
				plusOneDiet: 17000,
			}),
			undefined
		);
		assert.deepStrictEqual(
			parseGuest({
				name: "Barry",
				side: "James",
				family: false,
				plusOne: false,
				plusOneDiet: "pineapple does not belong on pizza",
			}),
			undefined
		);
		assert.deepStrictEqual(
			parseGuest({
				name: "Prince",
				side: "Molly",
				family: false,
				plusOneDiet: "mehh I like food",
			}),
			undefined
		);
		assert.deepStrictEqual(
			parseGuest({
				name: "Travis",
				side: "James",
				family: false,
				diet: "I like food!",
				plusOne: true,
				plusOneName: "Sally",
				plusOneDiet: true,
			}),
			undefined
		);

		// successful parse (2 inputs)
		assert.deepStrictEqual(
			parseGuest({
				name: "Alice",
				side: "Molly",
				family: true,
				diet: "pickles",
				plusOne: true,
				plusOneName: "Mad Hatter",
				plusOneDiet: "tea! tea and mustard of course",
			}),
			{
				name: "Alice",
				side: "Molly",
				family: true,
				diet: "pickles",
				plusOne: true,
				plusOneName: "Mad Hatter",
				plusOneDiet: "tea! tea and mustard of course",
			}
		);
		assert.deepStrictEqual(
			parseGuest({ name: "Barry", side: "James", family: false, plusOne: false }),
			{
				name: "Barry",
				side: "James",
				family: false,
				diet: undefined,
				plusOne: false,
				plusOneName: undefined,
				plusOneDiet: undefined,
			}
		);
		assert.deepStrictEqual(parseGuest({ name: "Prince", side: "Molly", family: false }), {
			name: "Prince",
			side: "Molly",
			family: false,
			diet: undefined,
			plusOne: undefined,
			plusOneName: undefined,
			plusOneDiet: undefined,
		});
		assert.deepStrictEqual(
			parseGuest({
				name: "Travis",
				side: "James",
				family: false,
				diet: "I like food!",
				plusOne: true,
				plusOneName: "Sally",
				plusOneDiet: "I'm allergic to shrimp!",
			}),
			{
				name: "Travis",
				side: "James",
				family: false,
				diet: "I like food!",
				plusOne: true,
				plusOneName: "Sally",
				plusOneDiet: "I'm allergic to shrimp!",
			}
		);
	});

	it("parseGuestArray", function () {
		const guest1: Guest = {
			name: "Brady Manske",
			side: "Molly",
			family: false,
			diet: undefined,
			plusOne: undefined,
			plusOneName: undefined,
			plusOneDiet: undefined,
		};
		const guest2: Guest = {
			name: "Alice",
			side: "James",
			family: true,
			diet: undefined,
			plusOne: true,
			plusOneName: "Cheshire Cat",
			plusOneDiet: undefined,
		};
		const guest3: Guest = {
			name: "Meemaw",
			side: "Molly",
			family: true,
			diet: undefined,
			plusOne: true,
			plusOneName: "Peepaw",
			plusOneDiet: "no pickles please",
		};
		const guest4: Guest = {
			name: "Sam",
			side: "James",
			family: true,
			diet: undefined,
			plusOne: undefined,
			plusOneName: undefined,
			plusOneDiet: undefined,
		};
		const guest5 = {
			name: "Barry",
			side: "James",
			family: false,
			diet: undefined,
			plusOne: false,
			plusOneName: undefined,
			plusOneDiet: undefined,
		};

		// 0 recursive calls, empty array (1 possible input)
		assert.deepStrictEqual(parseGuestArray([]), []);

		// 0 recursive calls, non-guest at first value (2 inputs)
		assert.deepStrictEqual(parseGuestArray(["I'm not a guest!"]), undefined);
		assert.deepStrictEqual(parseGuestArray([{ name: false }]), undefined);

		// 1 recursive call, array of 1 guest (2 inputs)
		assert.deepStrictEqual(parseGuestArray([guest1]), [guest1]);
		assert.deepStrictEqual(parseGuestArray([guest2]), [guest2]);

		// 1 recursive call, non-guest at second value (2 inputs)
		assert.deepStrictEqual(parseGuestArray([guest4, "oopsies"]), undefined);
		assert.deepStrictEqual(
			parseGuestArray([guest5, { name: "Alice", side: "Molly", family: true, diet: 17 }]),
			undefined
		);

		// many recursive calls (2 inputs)
		assert.deepStrictEqual(parseGuestArray([guest1, guest2, guest3, guest4, guest5]), [
			guest1,
			guest2,
			guest3,
			guest4,
			guest5,
		]);
		assert.deepStrictEqual(
			parseGuestArray([guest5, guest3, guest4, "whoops", guest2]),
			undefined
		);
	});
});
