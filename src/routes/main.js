import express from "express";
import {
	insertSql,
	selectSql,
	updateSql,
	deleteSql,
} from "../database/userSql.js";

const hbs = require("hbs");

hbs.registerHelper("eq", (a, b) => a === b);

function ceil(number, fix) {
	return (Math.ceil(number * (10 ^ fix)) / (10 ^ fix)).toFixed(fix);
}

const router = express.Router();

let name;
let query = "";
let page = 1;
let option = "book";

function range(start, end) {
	let array = [];
	for (let i = start; i < end; ++i) {
		array.push(i);
	}
	return array;
}

//user 메인 페이지
router.get("/", async (req, res) => {
	if (
		req.session.user !== undefined &&
		req.session.user.role === "Customer"
	) {
		name = await selectSql.getName(req.session.user.id);

		res.redirect(
			`/main/search?page=${page}&query=${query}&option=${option}`
		);
	} else {
		res.redirect("/");
	}
});

const getInfoFromTable = async (arg, req, res) => {
	try {
		// 클라이언트에서 page와 limit 요청 (기본값 설정)
		const page = parseInt(req.query.page) || 1; // 현재 페이지 번호 (기본값 1)
		const limit = parseInt(req.query.limit) || 10; // 페이지당 항목 수 (기본값 30)

		// OFFSET 계산
		const offset = (page - 1) * limit;

		let datas = [];

		// 데이터 가져오기, 총 데이터 개수 조회
		if (arg.type === "search") {
			[datas] = await selectSql.getSearch(
				arg.option,
				arg.query,
				limit,
				offset
			);
		} else if (arg.type === "reservation") {
			[datas] = await selectSql.getReservation(arg.email, limit, offset);
		} else if (arg.type === "shoppingBasket") {
			[datas] = await selectSql.getShoppingBasket(
				arg.email,
				limit,
				offset
			);
		} else if (arg.type === "purchaseHistory") {
			[datas] = await selectSql.getPurchaseHistory(
				arg.email,
				limit,
				offset
			);
		}
		let totalCount;
		if (datas.length === 0) {
			totalCount = 0;
		} else {
			totalCount = datas[0].totalCount;
		}

		// 총 페이지 수 계산
		const totalPages = Math.ceil(totalCount / limit);

		// 응답 데이터
		return {
			currentPage: page,
			totalPages: totalPages,
			totalCount: totalCount,
			data: datas, // 현재 페이지의 데이터
		};
	} catch (error) {
		console.error(error);
	}
};

// 검색 기능
router.get("/search", async (req, res) => {
	if (
		req.session.user !== undefined &&
		req.session.user.role === "Customer"
	) {
		option = req.query.option;
		if (option === undefined) {
			option = "book";
		}
		query = req.query.query;
		const arg = {
			type: "search",
			option: option,
			query: query,
		};

		const search_info = await getInfoFromTable(arg, req, res);
		const datas = search_info.data;
		page = search_info.currentPage;

		let startPage;
		if (search_info.currentPage % 10 === 0) {
			startPage = search_info.currentPage - 9;
		} else {
			startPage =
				search_info.currentPage - (search_info.currentPage % 10) + 1;
		}

		const endPage = startPage + 9;
		let prevPage = 0,
			nextPage = 0;
		if (startPage - 2 < 1) {
			prevPage = 1;
		} else {
			prevPage = startPage - 1;
		}
		if (endPage + 1 > search_info.totalPages) {
			nextPage = search_info.totalPages;
		} else {
			nextPage = endPage + 1;
		}
		const pageInfo = {
			currentPage: search_info.currentPage,
			startPage: startPage,
			endPage: endPage,
			totalPages: search_info.totalPages,
			totalCount: search_info.totalCount,
			prevPage: prevPage,
			nextPage: nextPage,
		};

		if (pageInfo.totalPages < pageInfo.endPage)
			pageInfo.endPage = pageInfo.totalPages;
		console.log(pageInfo);
		console.log(datas);

		res.render("user_main", {
			user: {
				name: name[0].Name,
			},
			searchResults: datas,
			Page: range(pageInfo.startPage, pageInfo.endPage + 1),
			pageInfo: pageInfo,
			option: option,
			query: query,
		});
	} else {
		res.redirect("/");
	}
});

// 예약 확인 페이지
router.get("/reservation", async (req, res) => {
	if (
		req.session.user !== undefined &&
		req.session.user.role === "Customer"
	) {
		const arg = {
			type: "reservation",
			email: req.session.user.id,
		};
		const reserv_info = await getInfoFromTable(arg, req, res);
		console.log(reserv_info);
		let datas = reserv_info.data;
		datas = datas.map((item) => {
			let result = item;
			let pickup_time = new Date(item.Pickup_time);
			let today = new Date();
			if (pickup_time <= today) {
				result.status = "confirmed";
			} else if (pickup_time > today) {
				result.status = "pending";
			}

			return result;
		});
		let startPage;
		if (reserv_info.currentPage % 10 === 0) {
			startPage = reserv_info.currentPage - 9;
		} else {
			startPage =
				reserv_info.currentPage - (reserv_info.currentPage % 10) + 1;
		}

		const endPage = startPage + 9;
		let prevPage = 0,
			nextPage = 0;
		if (startPage - 2 < 1) {
			prevPage = 1;
		} else {
			prevPage = startPage - 2;
		}
		if (endPage + 1 > reserv_info.totalPages) {
			nextPage = reserv_info.totalPages;
		} else {
			nextPage = endPage + 1;
		}
		const pageInfo = {
			currentPage: reserv_info.currentPage,
			startPage: startPage,
			endPage: endPage,
			totalPages: reserv_info.totalPages,
			totalCount: reserv_info.totalCount,
			prevPage: prevPage,
			nextPage: nextPage,
		};
		// console.log(datas);
		// console.log(pageInfo.totalPages);
		// console.log(pageInfo.endPage);
		if (pageInfo.totalPages < pageInfo.endPage)
			pageInfo.endPage = pageInfo.totalPages;
		res.render("user_reservation", {
			user: {
				name: name[0].Name,
			},
			reservations: datas,
			Page: range(pageInfo.startPage, pageInfo.endPage + 1),
			pageInfo: pageInfo,
		});
	} else {
		res.redirect("/");
	}
});
router.post("/reservation/addReservation", async (req, res) => {
	const input = req.body;
	console.log(req.query);
	console.log(input);
	const data = {
		Email: req.session.user.id,
		ISBN: input.ISBN,
		quantity: input.quantity,
		pickupTime: input.pickupTimeInput,
	};
	const result = await insertSql.insertReservation(data);

	if (result.success === true) {
		res.send(`<script>
			alert('예약 성공!');
			location.href='/main';
		</script>`);
	} else {
		res.send(`<script>
			alert('예약 실패! error:${result.error}');
			location.href='/main';
		</script>`);
	}
});
router.post("/reservation/pickupTimeModify", async (req, res) => {
	const input = req.body;
	const data = {
		id: input.ID,
		pickupTime: input.Pickup_time_modify,
	};

	const result = await updateSql.updatePickupTime(data);

	if (result.success === true) {
		res.send(`<script>
			alert('수정 성공!');
			location.href='/main/reservation/';
		</script>`);
	} else {
		res.send(`<script>
			alert('수정 실패! error:${result.error}');
			location.href='/main/reservation/';
		</script>`);
	}
});
router.post("/reservation/delete", async (req, res) => {
	const input = req.body;
	const data = {
		id: input.ID,
		ISBN: input.ISBN,
		Number: input.Number,
	};
	const result = await deleteSql.deleteReservation(data);

	if (result.success === true) {
		res.send(`<script>
			alert('삭제 성공!');
			location.href='/main/reservation/';
		</script>`);
	} else {
		res.send(`<script>
			alert('삭제 실패! error:${result.error}');
			location.href='/main/reservation/';
		</script>`);
	}
});

//장바구니 확인 페이지
router.get("/shoppingBasket", async (req, res) => {
	if (
		req.session.user !== undefined &&
		req.session.user.role === "Customer"
	) {
		const arg = {
			type: "shoppingBasket",
			email: req.session.user.id,
		};
		const shoppingBasketInfo = await getInfoFromTable(arg, req, res);
		console.log(shoppingBasketInfo);
		let datas = shoppingBasketInfo.data;
		let totalPrice = 0;

		datas.forEach((item) => {
			totalPrice +=
				Math.round(Number(item.Price) * item.Number * 100) / 100;
		});
		totalPrice = Math.round(totalPrice * 100) / 100;

		let startPage;
		if (shoppingBasketInfo.currentPage % 10 === 0) {
			startPage = shoppingBasketInfo.currentPage - 9;
		} else {
			startPage =
				shoppingBasketInfo.currentPage -
				(shoppingBasketInfo.currentPage % 10) +
				1;
		}

		const endPage = startPage + 9;
		let prevPage = 0,
			nextPage = 0;
		if (startPage - 2 < 1) {
			prevPage = 1;
		} else {
			prevPage = startPage - 2;
		}
		if (endPage + 1 > shoppingBasketInfo.totalPages) {
			nextPage = shoppingBasketInfo.totalPages;
		} else {
			nextPage = endPage + 1;
		}
		const pageInfo = {
			currentPage: shoppingBasketInfo.currentPage,
			startPage: startPage,
			endPage: endPage,
			totalPages: shoppingBasketInfo.totalPages,
			totalCount: shoppingBasketInfo.totalCount,
			prevPage: prevPage,
			nextPage: nextPage,
		};
		// console.log(datas);
		// console.log(pageInfo.totalPages);
		// console.log(pageInfo.endPage);
		if (pageInfo.totalPages < pageInfo.endPage)
			pageInfo.endPage = pageInfo.totalPages;
		res.render("user_shoppingBasket", {
			user: {
				name: name[0].Name,
			},
			shoppingBasket: datas,
			totalPrice: totalPrice,
			Page: range(pageInfo.startPage, pageInfo.endPage + 1),
			pageInfo: pageInfo,
		});
	} else {
		res.redirect("/");
	}
});
router.post("/shoppingBasket/addShoppingBasket", async (req, res) => {
	const input = req.body;
	const data = {
		Email: req.session.user.id,
		ISBN: input.ISBN,
		quantity: input.quantity,
	};
	const result = await insertSql.insertShoppingBasket(data);

	if (result.success === true) {
		res.send(`<script>
			alert('장바구니에 추가되었습니다!');
			location.href='/main';
		</script>`);
	} else {
		res.send(`<script>
			alert('장바구니 추가에 실패하였습니다! error:${result.error}');
			location.href='/main';
		</script>`);
	}
});
router.post("/shoppingBasket/delete", async (req, res) => {
	const input = req.body;
	const data = {
		BasketID: input.BasketID,
		ISBN: input.ISBN,
		Number: input.Number,
	};
	const result = await deleteSql.deleteShoppingBasket(data);

	if (result.success === true) {
		res.send(`<script>
			alert('삭제 성공!');
			location.href='/main/shoppingBasket/';
		</script>`);
	} else {
		res.send(`<script>
			alert('삭제 실패! error:${result.error}');
			location.href='/main/shoppingBasket/';
		</script>`);
	}
});
router.post("/shoppingBasket/purchase", async (req, res) => {
	const input = req.body;
	const data = {
		BasketID: input.BasketID,
	};
	console.log(data);
	const result = await updateSql.updateOrderDate(data);

	if (result.success === true) {
		res.status(200).send("구매완료");
	} else {
		res.status(500).send("구매실패");
	}
});

//구매이력 확인 페이지
router.get("/purchaseHistory", async (req, res) => {
	if (
		req.session.user !== undefined &&
		req.session.user.role === "Customer"
	) {
		const arg = {
			type: "purchaseHistory",
			email: req.session.user.id,
		};
		const purchaseHistory = await getInfoFromTable(arg, req, res);
		console.log(purchaseHistory);
		let datas = purchaseHistory.data;

		let startPage;
		if (purchaseHistory.currentPage % 10 === 0) {
			startPage = purchaseHistory.currentPage - 9;
		} else {
			startPage =
				purchaseHistory.currentPage -
				(purchaseHistory.currentPage % 10) +
				1;
		}

		const endPage = startPage + 9;
		let prevPage = 0,
			nextPage = 0;
		if (startPage - 2 < 1) {
			prevPage = 1;
		} else {
			prevPage = startPage - 2;
		}
		if (endPage + 1 > purchaseHistory.totalPages) {
			nextPage = purchaseHistory.totalPages;
		} else {
			nextPage = endPage + 1;
		}
		const pageInfo = {
			currentPage: purchaseHistory.currentPage,
			startPage: startPage,
			endPage: endPage,
			totalPages: purchaseHistory.totalPages,
			totalCount: purchaseHistory.totalCount,
			prevPage: prevPage,
			nextPage: nextPage,
		};
		// console.log(datas);
		// console.log(pageInfo.totalPages);
		console.log(pageInfo);
		if (pageInfo.totalPages < pageInfo.endPage)
			pageInfo.endPage = pageInfo.totalPages;
		res.render("user_purchaseHistory", {
			user: {
				name: name[0].Name,
			},
			orders: datas,
			Page: range(pageInfo.startPage, pageInfo.endPage + 1),
			pageInfo: pageInfo,
		});
	} else {
		res.redirect("/");
	}
});
router.post("/purchaseHistory/details", async (req, res) => {
	const input = req.body;

	const data = {
		BasketID: input.BasketID,
	};

	const result = await selectSql.getOrderDetails(data);
	console.log(result.books);
	if (result.success === true) {
		res.status(200).json({ books: result.books });
	} else {
		res.status(500).send("서버로부터 구매이력을 불러오지 못했습니다.");
	}
});
module.exports = router;
