const express = require("express")
const db = require("../data/dbConfig");

const router = express.Router()

router.get("/", async (req, res, next) => {
	try {
		// translates to `SELECT * FROM "accounts";`
		// const accounts = await db.select("*").from("accounts")
		const accounts = await db("accounts");
		res.json(accounts)
	} catch (error) {
		next(error)
	}
})

router.get("/:id", async (req, res, next) => {
	try {
		// SELECT * FROM "accounts" WHERE "id" = someID LIMIT 1;
		// const [account] = await db.select("*").from("accounts").where("id", req.params.id).limit(1)
		const account = await db("accounts").where("id", req.params.id).first()
		if (!account) {
			res.status(404).json({message: `Data not found !`});
		}
		res.json(account)
	} catch (error) {
		next(error)
	}
})

router.post("/", async (req, res, next) => {
	try {
		const payload = {
			name: req.body.name,
			budget: req.body.budget,
		}

		// translates to `INSERT INTO "accounts" ("name", "budget") VALUES (?, ?);`
		const [id] = await db("accounts").insert(payload)
		const account = await db("accounts").where("id", id).first()

		res.json(account)
	} catch (error) {
		next(error)
	}
})

router.put("/:id", async (req, res, next) => {
	try {
		const payload = {
			name: req.body.name,
			budget: req.body.budget,
		}

		// translates to `UPDATE "accounts" SET "name" = ? AND "budget" = ? WHERE "id" = ?;`
		await db("accounts").where("id", req.params.id).update(payload)
		const updatedAccount = await db("accounts").where("id", req.params.id).first()

		res.json(updatedAccount)
	} catch (error) {
		next(error)
	}
})

router.delete("/:id", async (req, res, next) => {
	try {
		// translates to `DELETE FROM "accounts" WHERE "id" = ?;`
		await db("accounts").where("id", req.params.id).del()
		res.status(204).end()
	} catch (error) {
		next(error)
	}
})

module.exports = router