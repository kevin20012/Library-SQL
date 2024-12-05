import express from "express";
import { loginSql } from "../database/sql";

const router = express.Router();

router.get("/", (req, res) => {
	res.render("login");
});

router.post("/login", async (req, res) => {
	// const body = req.body;
	// const user = await loginSql.getLoginCustomer(body.id, body.password);

	// if (user.length !== 0) {
	// 	req.session.user = {
	// 		id: user[0].Email,
	// 		role: user[0].Role,
	// 		checkLogin: true,
	// 	};
	// }
	// delete after
	req.session.user = {
		id: "kevin@naver.com",
		role: "Customer",
		checkLogin: true,
	};

	// req.session.user = {
	// 	id: "admin",
	// 	role: "Administrator",
	// 	checkLogin: true,
	// };

	console.log(req.session.user);

	if (req.session.user === undefined) {
		console.log("login failed!");
		res.send(`<script>
                    alert('login failed!');
                    location.href='/';
                </script>`);
	} else if (
		req.session.user.checkLogin &&
		req.session.user.role === "Administrator"
	) {
		res.redirect("/admin");
	} else if (
		req.session.user.checkLogin &&
		req.session.user.role === "Customer"
	) {
		res.redirect("/main");
	}
});

module.exports = router;
