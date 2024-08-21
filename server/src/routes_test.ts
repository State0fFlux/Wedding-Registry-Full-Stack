import * as assert from "assert";
import * as httpMocks from "node-mocks-http";
import { listGuests, resetForTesting, saveGuest, updateGuest, loadGuest } from "./routes";

describe("routes", function () {
	it("list", function () {
		// Straight-line code, test 2 inputs minimum
		// tests on empty array
		const req1 = httpMocks.createRequest({ method: "GET", url: "/api/list" });
		const res1 = httpMocks.createResponse();
		listGuests(req1, res1);
		assert.strictEqual(res1._getStatusCode(), 200);
		assert.deepStrictEqual(res1._getData(), { guests: [] });

		const req2 = httpMocks.createRequest({
			method: "POST",
			url: "/api/save",
			body: { name: "Brady", side: "James", family: false },
		});
		const res2 = httpMocks.createResponse();
		saveGuest(req2, res2);

		const req3 = httpMocks.createRequest({ method: "GET", url: "/api/list" });
		const res3 = httpMocks.createResponse();
		listGuests(req3, res3);
		assert.strictEqual(res3._getStatusCode(), 200);
		assert.deepStrictEqual(res3._getData(), {
			guests: [{ name: "Brady", side: "James", family: false }],
		});

		const req4 = httpMocks.createRequest({
			method: "POST",
			url: "/api/save",
			body: { name: "Katie", side: "Molly", family: true },
		});
		const res4 = httpMocks.createResponse();
		saveGuest(req4, res4);

		const req5 = httpMocks.createRequest({ method: "GET", url: "/api/list" });
		const res5 = httpMocks.createResponse();
		listGuests(req5, res5);
		assert.strictEqual(res5._getStatusCode(), 200);
		assert.deepStrictEqual(res5._getData(), {
			guests: [
				{ name: "Brady", side: "James", family: false },
				{ name: "Katie", side: "Molly", family: true },
			],
		});

		const req6 = httpMocks.createRequest({
			method: "POST",
			url: "/api/save",
			body: { name: "Kevin", side: "James", family: true },
		});
		const res6 = httpMocks.createResponse();
		saveGuest(req6, res6);

		const req7 = httpMocks.createRequest({ method: "GET", url: "/api/list" });
		const res7 = httpMocks.createResponse();
		listGuests(req7, res7);
		assert.strictEqual(res7._getStatusCode(), 200);
		assert.deepStrictEqual(res7._getData(), {
			guests: [
				{ name: "Brady", side: "James", family: false },
				{ name: "Katie", side: "Molly", family: true },
				{ name: "Kevin", side: "James", family: true },
			],
		});

		// ensures ordering is alphabetical
		const req8 = httpMocks.createRequest({
			method: "POST",
			url: "/api/save",
			body: { name: "Anna", side: "Molly", family: false },
		});
		const res8 = httpMocks.createResponse();
		saveGuest(req8, res8);

		const req9 = httpMocks.createRequest({ method: "GET", url: "/api/list" });
		const res9 = httpMocks.createResponse();
		listGuests(req9, res9);
		assert.strictEqual(res9._getStatusCode(), 200);
		assert.deepStrictEqual(res9._getData(), {
			guests: [
				{ name: "Anna", side: "Molly", family: false },
				{ name: "Brady", side: "James", family: false },
				{ name: "Katie", side: "Molly", family: true },
				{ name: "Kevin", side: "James", family: true },
			],
		});

		const req10 = httpMocks.createRequest({
			method: "POST",
			url: "/api/save",
			body: { name: "Katiee", side: "James", family: false },
		});
		const res10 = httpMocks.createResponse();
		saveGuest(req10, res10);

		const req11 = httpMocks.createRequest({ method: "GET", url: "/api/list" });
		const res11 = httpMocks.createResponse();
		listGuests(req11, res11);
		assert.strictEqual(res11._getStatusCode(), 200);
		assert.deepStrictEqual(res11._getData(), {
			guests: [
				{ name: "Anna", side: "Molly", family: false },
				{ name: "Brady", side: "James", family: false },
				{ name: "Katie", side: "Molly", family: true },
				{ name: "Katiee", side: "James", family: false },
				{ name: "Kevin", side: "James", family: true },
			],
		});
		resetForTesting();
	});

	it("save", function () {
		// Missing name; non-string (2 inputs)
		const req1 = httpMocks.createRequest({ method: "POST", url: "/api/save", body: {} });
		const res1 = httpMocks.createResponse();
		saveGuest(req1, res1);
		assert.strictEqual(res1._getStatusCode(), 400);
		assert.deepStrictEqual(res1._getData(), "missing 'name' parameter");

		const req2 = httpMocks.createRequest({
			method: "POST",
			url: "/api/save",
			body: { name: 5 },
		});
		const res2 = httpMocks.createResponse();
		saveGuest(req2, res2);
		assert.strictEqual(res2._getStatusCode(), 400);
		assert.deepStrictEqual(res2._getData(), "missing 'name' parameter");

		// Missing side; non-string (2 inputs)
		const req3 = httpMocks.createRequest({
			method: "POST",
			url: "/api/save",
			body: { name: "Brady" },
		});
		const res3 = httpMocks.createResponse();
		saveGuest(req3, res3);
		assert.strictEqual(res3._getStatusCode(), 400);
		assert.deepStrictEqual(res3._getData(), "missing 'side' parameter");

		const req4 = httpMocks.createRequest({
			method: "POST",
			url: "/api/save",
			body: { name: "Bradley", side: 9 },
		});
		const res4 = httpMocks.createResponse();
		saveGuest(req4, res4);
		assert.strictEqual(res4._getStatusCode(), 400);
		assert.deepStrictEqual(res4._getData(), "missing 'side' parameter");

		// Invalid side; not "James" nor "Molly" (2 inputs)
		const req5 = httpMocks.createRequest({
			method: "POST",
			url: "/api/save",
			body: { name: "Ana", side: "NEITHER" },
		});
		const res5 = httpMocks.createResponse();
		saveGuest(req5, res5);
		assert.strictEqual(res5._getStatusCode(), 400);
		assert.deepStrictEqual(
			res5._getData(),
			"side parameter was not expected value. side: 'NEITHER'. expected: 'Molly' | 'James'."
		);

		const req6 = httpMocks.createRequest({
			method: "POST",
			url: "/api/save",
			body: { name: "Anna", side: "Mollie" },
		});
		const res6 = httpMocks.createResponse();
		saveGuest(req6, res6);
		assert.strictEqual(res6._getStatusCode(), 400);
		assert.deepStrictEqual(
			res6._getData(),
			"side parameter was not expected value. side: 'Mollie'. expected: 'Molly' | 'James'."
		);

		// Missing family; non-boolean (2 inputs)
		const req7 = httpMocks.createRequest({
			method: "POST",
			url: "/api/save",
			body: { name: "Brett", side: "James" },
		});
		const res7 = httpMocks.createResponse();
		saveGuest(req7, res7);
		assert.strictEqual(res7._getStatusCode(), 400);
		assert.deepStrictEqual(res7._getData(), "missing 'family' parameter");

		const req8 = httpMocks.createRequest({
			method: "POST",
			url: "/api/save",
			body: { name: "Alice", side: "Molly", family: "true" },
		});
		const res8 = httpMocks.createResponse();
		saveGuest(req8, res8);
		assert.strictEqual(res8._getStatusCode(), 400);
		assert.deepStrictEqual(res8._getData(), "missing 'family' parameter");

		// Successful save (2 inputs)
		const req9 = httpMocks.createRequest({
			method: "POST",
			url: "/api/save",
			body: { name: "Travis", side: "James", family: false },
		});
		const res9 = httpMocks.createResponse();
		saveGuest(req9, res9);
		assert.strictEqual(res9._getStatusCode(), 200);
		assert.deepStrictEqual(res9._getData(), {
			guest: { name: "Travis", side: "James", family: false },
		});

		const req10 = httpMocks.createRequest({
			method: "POST",
			url: "/api/save",
			body: { name: "Alice", side: "Molly", family: true },
		});
		const res10 = httpMocks.createResponse();
		saveGuest(req10, res10);
		assert.strictEqual(res10._getStatusCode(), 200);
		assert.deepStrictEqual(res10._getData(), {
			guest: { name: "Alice", side: "Molly", family: true },
		});

		// Pre-existing guest (2 inputs)
		const req11 = httpMocks.createRequest({
			method: "POST",
			url: "/api/save",
			body: { name: "Travis", side: "Molly", family: true },
		});
		const res11 = httpMocks.createResponse();
		saveGuest(req11, res11);
		assert.strictEqual(res11._getStatusCode(), 400);
		assert.deepStrictEqual(
			res11._getData(),
			"guest: 'Travis' is already entered into the registry"
		);

		const req12 = httpMocks.createRequest({
			method: "POST",
			url: "/api/save",
			body: { name: "Alice", side: "James", family: false },
		});
		const res12 = httpMocks.createResponse();
		saveGuest(req12, res12);
		assert.strictEqual(res12._getStatusCode(), 400);
		assert.deepStrictEqual(
			res12._getData(),
			"guest: 'Alice' is already entered into the registry"
		);
		resetForTesting();
	});

	it("load", function () {
		// TODO: GET NOT POST (copy list format)
	});

	it("update", function () {
		// Missing or invalid name (2 inputs)
		const req1 = httpMocks.createRequest({ method: "POST", url: "/api/update", body: {} });
		const res1 = httpMocks.createResponse();
		updateGuest(req1, res1);
		assert.strictEqual(res1._getStatusCode(), 400);
		assert.deepStrictEqual(res1._getData(), "missing or invalid 'name' parameter");

		const req2 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: { name: 5 },
		});
		const res2 = httpMocks.createResponse();
		updateGuest(req2, res2);
		assert.strictEqual(res2._getStatusCode(), 400);
		assert.deepStrictEqual(res2._getData(), "missing or invalid 'name' parameter");

		// Missing or invalid side (2 inputs)
		const req3 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: { name: "Brady" },
		});
		const res3 = httpMocks.createResponse();
		updateGuest(req3, res3);
		assert.strictEqual(res3._getStatusCode(), 400);
		assert.deepStrictEqual(res3._getData(), "missing or invalid 'side' parameter");

		const req4 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: { name: "Bradley", side: 9 },
		});
		const res4 = httpMocks.createResponse();
		updateGuest(req4, res4);
		assert.strictEqual(res4._getStatusCode(), 400);
		assert.deepStrictEqual(res4._getData(), "missing or invalid 'side' parameter");

		const req5 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: { name: "Ana", side: "NEITHER" },
		});
		const res5 = httpMocks.createResponse();
		updateGuest(req5, res5);
		assert.strictEqual(res5._getStatusCode(), 400);
		assert.deepStrictEqual(res5._getData(), "missing or invalid 'side' parameter");

		const req6 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: { name: "Anna", side: "Mollie" },
		});
		const res6 = httpMocks.createResponse();
		updateGuest(req6, res6);
		assert.strictEqual(res6._getStatusCode(), 400);
		assert.deepStrictEqual(res6._getData(), "missing or invalid 'side' parameter");

		// Missing or invalid family (2 inputs)
		const req7 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: { name: "Brett", side: "James" },
		});
		const res7 = httpMocks.createResponse();
		updateGuest(req7, res7);
		assert.strictEqual(res7._getStatusCode(), 400);
		assert.deepStrictEqual(res7._getData(), "missing or invalid 'family' parameter");

		const req8 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: { name: "Alice", side: "Molly", family: "true" },
		});
		const res8 = httpMocks.createResponse();
		updateGuest(req8, res8);
		assert.strictEqual(res8._getStatusCode(), 400);
		assert.deepStrictEqual(res8._getData(), "missing or invalid 'family' parameter");

		// Missing or invalid diet (2 inputs)
		const req9 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: { name: "Brett", side: "James", family: false, diet: 5 },
		});
		const res9 = httpMocks.createResponse();
		updateGuest(req9, res9);
		assert.strictEqual(res9._getStatusCode(), 400);
		assert.deepStrictEqual(res9._getData(), "missing or invalid 'diet' parameter");

		const req10 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: { name: "Alice", side: "Molly", family: true, diet: true },
		});
		const res10 = httpMocks.createResponse();
		updateGuest(req10, res10);
		assert.strictEqual(res10._getStatusCode(), 400);
		assert.deepStrictEqual(res10._getData(), "missing or invalid 'diet' parameter");

		// Missing or invalid plusOne (2 inputs)
		const req11 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: { name: "Brett", side: "James", family: false, plusOne: 900 },
		});
		const res11 = httpMocks.createResponse();
		updateGuest(req11, res11);
		assert.strictEqual(res11._getStatusCode(), 400);
		assert.deepStrictEqual(res11._getData(), "missing or invalid 'plusOne' parameter");

		const req12 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: {
				name: "Alice",
				side: "Molly",
				family: true,
				diet: "beans",
				plusOne: "yes please!",
			},
		});
		const res12 = httpMocks.createResponse();
		updateGuest(req12, res12);
		assert.strictEqual(res12._getStatusCode(), 400);
		assert.deepStrictEqual(res12._getData(), "missing or invalid 'plusOne' parameter");

		// Missing or invalid plusOneName (2 inputs)
		const req13 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: {
				name: "Brett",
				side: "James",
				family: false,
				diet: "fries",
				plusOneName: "Frederick",
			},
		});
		const res13 = httpMocks.createResponse();
		updateGuest(req13, res13);
		assert.strictEqual(res13._getStatusCode(), 400);
		assert.deepStrictEqual(res13._getData(), "missing or invalid 'plusOneName' parameter");

		const req14 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: { name: "Alice", side: "Molly", family: true, plusOne: true, plusOneName: 8 },
		});
		const res14 = httpMocks.createResponse();
		updateGuest(req14, res14);
		assert.strictEqual(res14._getStatusCode(), 400);
		assert.deepStrictEqual(res14._getData(), "missing or invalid 'plusOneName' parameter");

		const req15 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: { name: "Brett", side: "James", family: false, diet: "fries", plusOne: true },
		});
		const res15 = httpMocks.createResponse();
		updateGuest(req15, res15);
		assert.strictEqual(res15._getStatusCode(), 400);
		assert.deepStrictEqual(res15._getData(), "missing or invalid 'plusOneName' parameter");

		const req16 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: {
				name: "Alice",
				side: "Molly",
				family: true,
				diet: "pickles ewww",
				plusOne: false,
				plusOneName: "Jacob",
			},
		});
		const res16 = httpMocks.createResponse();
		updateGuest(req16, res16);
		assert.strictEqual(res16._getStatusCode(), 400);
		assert.deepStrictEqual(res16._getData(), "missing or invalid 'plusOneName' parameter");

		// Missing or invalid plusOneDiet (2 inputs)
		const req17 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: {
				name: "Brett",
				side: "James",
				family: false,
				diet: "fries",
				plusOne: false,
				plusOneDiet: "no beans please",
			},
		});
		const res17 = httpMocks.createResponse();
		updateGuest(req17, res17);
		assert.strictEqual(res17._getStatusCode(), 400);
		assert.deepStrictEqual(res17._getData(), "missing or invalid 'plusOneDiet' parameter");

		const req18 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: {
				name: "Alice",
				side: "Molly",
				family: true,
				diet: "popcorn",
				plusOneDiet: "BURPP",
			},
		});
		const res18 = httpMocks.createResponse();
		updateGuest(req18, res18);
		assert.strictEqual(res18._getStatusCode(), 400);
		assert.deepStrictEqual(res18._getData(), "missing or invalid 'plusOneDiet' parameter");

		const req19 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: {
				name: "Brett",
				side: "James",
				family: false,
				diet: "fries",
				plusOne: true,
				plusOneName: "Keston",
				plusOneDiet: 666,
			},
		});
		const res19 = httpMocks.createResponse();
		updateGuest(req19, res19);
		assert.strictEqual(res19._getStatusCode(), 400);
		assert.deepStrictEqual(res19._getData(), "missing or invalid 'plusOneDiet' parameter");

		const req20 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: {
				name: "Alice",
				side: "Molly",
				family: true,
				plusOne: false,
				plusOneDiet: "Pizza! I hate anchovies on my pizza :(",
			},
		});
		const res20 = httpMocks.createResponse();
		updateGuest(req20, res20);
		assert.strictEqual(res20._getStatusCode(), 400);
		assert.deepStrictEqual(res20._getData(), "missing or invalid 'plusOneDiet' parameter");

		// No guest to update (2 inputs)
		const req21 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: { name: "Georgie", side: "Molly", family: true },
		});
		const res21 = httpMocks.createResponse();
		updateGuest(req21, res21);
		assert.strictEqual(res21._getStatusCode(), 400);
		assert.deepStrictEqual(
			res21._getData(),
			"guest: 'Georgie' must exist in the registry in order to update their information"
		);

		const req22 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: { name: "Sandra", side: "James", family: false },
		});
		const res22 = httpMocks.createResponse();
		updateGuest(req22, res22);
		assert.strictEqual(res22._getStatusCode(), 400);
		assert.deepStrictEqual(
			res22._getData(),
			"guest: 'Sandra' must exist in the registry in order to update their information"
		);

		// Update successful (2 inputs)
		const req23 = httpMocks.createRequest({
			method: "POST",
			url: "/api/save",
			body: { name: "Travis", side: "James", family: false },
		});
		const res23 = httpMocks.createResponse();
		saveGuest(req23, res23);
		assert.strictEqual(res23._getStatusCode(), 200);
		assert.deepStrictEqual(res23._getData(), {
			guest: { name: "Travis", side: "James", family: false },
		});

		const req24 = httpMocks.createRequest({
			method: "POST",
			url: "/api/save",
			body: { name: "Alice", side: "Molly", family: true },
		});
		const res24 = httpMocks.createResponse();
		saveGuest(req24, res24);
		assert.strictEqual(res24._getStatusCode(), 200);
		assert.deepStrictEqual(res24._getData(), {
			guest: { name: "Alice", side: "Molly", family: true },
		});

		const req25 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: { name: "Travis", side: "Molly", family: true, diet: "Ham", plusOne: false },
		});
		const res25 = httpMocks.createResponse();
		updateGuest(req25, res25);
		assert.strictEqual(res25._getStatusCode(), 200);
		assert.deepStrictEqual(res25._getData(), {
			guest: {
				name: "Travis",
				side: "Molly",
				family: true,
				diet: "Ham",
				plusOne: false,
				plusOneName: undefined,
				plusOneDiet: undefined,
			},
		});

		const req26 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: {
				name: "Alice",
				side: "James",
				family: false,
				diet: "Sugar-free please!",
				plusOne: true,
				plusOneName: "What's it to you?!",
				plusOneDiet: "He'll eat anything lol",
			},
		});
		const res26 = httpMocks.createResponse();
		updateGuest(req26, res26);
		assert.strictEqual(res26._getStatusCode(), 200);
		assert.deepStrictEqual(res26._getData(), {
			guest: {
				name: "Alice",
				side: "James",
				family: false,
				diet: "Sugar-free please!",
				plusOne: true,
				plusOneName: "What's it to you?!",
				plusOneDiet: "He'll eat anything lol",
			},
		});

		const req27 = httpMocks.createRequest({ method: "GET", url: "/api/list" });
		const res27 = httpMocks.createResponse();
		listGuests(req27, res27);
		assert.strictEqual(res27._getStatusCode(), 200);
		assert.deepStrictEqual(res27._getData(), {
			guests: [
				{
					name: "Alice",
					side: "James",
					family: false,
					diet: "Sugar-free please!",
					plusOne: true,
					plusOneName: "What's it to you?!",
					plusOneDiet: "He'll eat anything lol",
				},
				{
					name: "Travis",
					side: "Molly",
					family: true,
					diet: "Ham",
					plusOne: false,
					plusOneName: undefined,
					plusOneDiet: undefined,
				},
			],
		});
		resetForTesting();
	});

	it("load", function () {
		// Missing name in query (2 inputs)
		const req1 = httpMocks.createRequest({ method: "GET", url: "/api/load" });
		const res1 = httpMocks.createResponse();
		loadGuest(req1, res1);
		assert.strictEqual(res1._getStatusCode(), 400);
		assert.deepStrictEqual(res1._getData(), "missing 'name' query parameter");

		const req2 = httpMocks.createRequest({ method: "GET", url: "/api/load?nameSIKE=LOL" });
		const res2 = httpMocks.createResponse();
		loadGuest(req2, res2);
		assert.strictEqual(res2._getStatusCode(), 400);
		assert.deepStrictEqual(res2._getData(), "missing 'name' query parameter");

		// No such guest in registry (2 inputs)
		const req3 = httpMocks.createRequest({ method: "GET", url: "/api/load?name=Brady" });
		const res3 = httpMocks.createResponse();
		loadGuest(req3, res3);
		assert.strictEqual(res3._getStatusCode(), 400);
		assert.deepStrictEqual(res3._getData(), "no guest with name 'Brady'");

		const req4 = httpMocks.createRequest({ method: "GET", url: "/api/load?name=6" });
		const res4 = httpMocks.createResponse();
		loadGuest(req4, res4);
		assert.strictEqual(res4._getStatusCode(), 400);
		assert.deepStrictEqual(res4._getData(), "no guest with name '6'");

		// Successful load (2 inputs)
		const req5 = httpMocks.createRequest({
			method: "POST",
			url: "/api/save",
			body: { name: "Brady Manske", side: "James", family: false },
		});
		const res5 = httpMocks.createResponse();
		saveGuest(req5, res5);
		assert.strictEqual(res5._getStatusCode(), 200);
		assert.deepStrictEqual(res5._getData(), {
			guest: { name: "Brady Manske", side: "James", family: false },
		});

		const req6 = httpMocks.createRequest({
			method: "POST",
			url: "/api/save",
			body: { name: "Alice", side: "Molly", family: true },
		});
		const res6 = httpMocks.createResponse();
		saveGuest(req6, res6);
		assert.strictEqual(res6._getStatusCode(), 200);
		assert.deepStrictEqual(res6._getData(), {
			guest: { name: "Alice", side: "Molly", family: true },
		});

		const req7 = httpMocks.createRequest({ method: "GET", url: "/api/load?name=Brady Manske" });
		const res7 = httpMocks.createResponse();
		loadGuest(req7, res7);
		assert.strictEqual(res7._getStatusCode(), 200);
		assert.deepStrictEqual(res7._getData(), {
			guest: { name: "Brady Manske", side: "James", family: false },
		});

		const req8 = httpMocks.createRequest({ method: "GET", url: "/api/load?name=Alice" });
		const res8 = httpMocks.createResponse();
		loadGuest(req8, res8);
		assert.strictEqual(res8._getStatusCode(), 200);
		assert.deepStrictEqual(res8._getData(), {
			guest: { name: "Alice", side: "Molly", family: true },
		});

		const req9 = httpMocks.createRequest({
			method: "POST",
			url: "/api/update",
			body: {
				name: "Brady Manske",
				side: "Molly",
				family: true,
				diet: "Ham",
				plusOne: false,
			},
		});
		const res9 = httpMocks.createResponse();
		updateGuest(req9, res9);
		assert.strictEqual(res9._getStatusCode(), 200);
		assert.deepStrictEqual(res9._getData(), {
			guest: {
				name: "Brady Manske",
				side: "Molly",
				family: true,
				diet: "Ham",
				plusOne: false,
				plusOneName: undefined,
				plusOneDiet: undefined,
			},
		});

		const req10 = httpMocks.createRequest({
			method: "GET",
			url: "/api/load?name=Brady Manske",
		});
		const res10 = httpMocks.createResponse();
		loadGuest(req10, res10);
		assert.strictEqual(res10._getStatusCode(), 200);
		assert.deepStrictEqual(res10._getData(), {
			guest: {
				name: "Brady Manske",
				side: "Molly",
				family: true,
				diet: "Ham",
				plusOne: false,
				plusOneName: undefined,
				plusOneDiet: undefined,
			},
		});
	});
});
