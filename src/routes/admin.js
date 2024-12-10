import express from "express";
import {
	insertSql,
	selectSql,
	deleteSql,
	updateSql,
} from "../database/adminSql";

const router = express.Router();

const hbs = require("hbs");

hbs.registerHelper("eq", (a, b) => a === b);

function range(start, end) {
	let array = [];
	for (let i = start; i < end; ++i) {
		array.push(i);
	}
	return array;
}
const getInfoFromTable = async (tableName, req, res) => {
	try {
		// 클라이언트에서 page와 limit 요청 (기본값 설정)
		const page = parseInt(req.query.page) || 1; // 현재 페이지 번호 (기본값 1)
		const limit = parseInt(req.query.limit) || 30; // 페이지당 항목 수 (기본값 30)

		// OFFSET 계산
		const offset = (page - 1) * limit;

		let datas = [];
		let totalCountResult = [];

		// 데이터 가져오기, 총 데이터 개수 조회
		if (tableName === "customer") {
			[datas, totalCountResult] = await selectSql.getCustomer(
				limit,
				offset
			);
			console.log(datas, totalCountResult);
		} else if (tableName === "book") {
			[datas, totalCountResult] = await selectSql.getBook(limit, offset);
		} else if (tableName === "author") {
			[datas, totalCountResult] = await selectSql.getAuthor(
				limit,
				offset
			);
		} else if (tableName === "award") {
			[datas, totalCountResult] = await selectSql.getAward(limit, offset);
		} else if (tableName === "warehouse") {
			[datas, totalCountResult] = await selectSql.getWarehouse(
				limit,
				offset
			);
		} else if (tableName === "reservation") {
			[datas, totalCountResult] = await selectSql.getReservation(
				limit,
				offset
			);
		} else if (tableName === "shoppingBasket") {
			[datas, totalCountResult] = await selectSql.getShoppingBasket(
				limit,
				offset
			);
		} else if (tableName === "inventory") {
			[datas, totalCountResult] = await selectSql.getInventory(
				limit,
				offset
			);
		} else if (tableName === "authorHasAward") {
			[datas, totalCountResult] = await selectSql.getAuthorHasAward(
				limit,
				offset
			);
		} else if (tableName === "awardHasBook") {
			[datas, totalCountResult] = await selectSql.getAwardHasBook(
				limit,
				offset
			);
		}

		const totalCount = totalCountResult[0].totalCount;

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
function myRouter(router, entity) {
	return router.get("/" + entity, async (req, res) => {
		if (
			req.session.user !== undefined &&
			req.session.user.role === "Administrator"
		) {
			const entity_info = await getInfoFromTable(entity, req, res);
			const datas = entity_info.data;

			let startPage;
			if (entity_info.currentPage % 10 === 0) {
				startPage = entity_info.currentPage - 9;
			} else {
				startPage =
					entity_info.currentPage -
					(entity_info.currentPage % 10) +
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
			if (endPage + 1 > entity_info.totalPages) {
				nextPage = entity_info.totalPages;
			} else {
				nextPage = endPage + 1;
			}

			const pageInfo = {
				currentPage: entity_info.currentPage,
				startPage: startPage,
				endPage: endPage,
				totalPages: entity_info.totalPages,
				totalCount: entity_info.totalCount,
				prevPage: prevPage,
				nextPage: nextPage,
			};
			if (pageInfo.totalPages < pageInfo.endPage)
				pageInfo.endPage = pageInfo.totalPages;
			console.log(datas);
			res.render("admin_" + entity, {
				Data: datas,
				Page: range(pageInfo.startPage, pageInfo.endPage),
				pageInfo: pageInfo,
			});
		} else {
			res.redirect("/");
		}
	});
}
//admin 메인 페이지
router.get("/", async (req, res) => {
	if (
		req.session.user !== undefined &&
		req.session.user.role === "Administrator"
	) {
		res.render("admin");
	} else {
		res.redirect("/");
	}
});
//페이지로 보여주기 위한 테이블 내 요소 정보 출력 함수

// ----------------------------Customer----------------------------
//보여주기
myRouter(router, "customer");
// 추가
router.post("/customer/insert", async (req, res) => {
	const input = req.body;
	const data = {
		email: input.email,
		phone: input.phone,
		address: input.address,
		name: input.name,
		password: input.password,
	};

	const result = await insertSql.insertCustomer(data);

	if (result.success === true) {
		res.send(`<script>
			alert('추가 성공!');
			location.href='/admin/customer/';
		</script>`);
	} else {
		res.send(`<script>
			alert('추가 실패! error:${result.error}');
			location.href='/admin/customer/';
		</script>`);
	}
});
//삭제
router.post("/customer/delete", async (req, res) => {
	const key = req.body.email_origin;

	const result = await deleteSql.deleteCustomer(key);

	if (result.success === true) {
		res.send(`<script>
			alert('삭제 성공!');
			location.href='/admin/customer/';
		</script>`);
	} else {
		res.send(`<script>
			alert('삭제 실패! error:${result.error}');
			location.href='/admin/customer/';
		</script>`);
	}
});
//수정
router.post("/customer/update", async (req, res) => {
	const data = req.body;

	const result = await updateSql.updateCustomer(data);

	if (result.success === true) {
		res.send(`<script>
			alert('수정 성공!');
			location.href='/admin/customer/';
		</script>`);
	} else {
		res.send(`<script>
			alert('수정 실패! error:${result.error}');
			location.href='/admin/customer/';
		</script>`);
	}
});
// ----------------------------Book----------------------------
//보여주기
myRouter(router, "book");
// 추가
router.post("/book/insert", async (req, res) => {
	const input = req.body;
	const data = {
		ISBN: input.ISBN,
		Category: input.Category,
		Price: input.Price,
		Title: input.Title,
		Year: input.Year,
		Author_ID: input.Author_ID,
	};

	const result = await insertSql.insertBook(data);

	if (result.success === true) {
		res.send(`<script>
			alert('추가 성공!');
			location.href='/admin/book/';
		</script>`);
	} else {
		res.send(`<script>
			alert('추가 실패! error:${result.error}');
			location.href='/admin/book/';
		</script>`);
	}
});
//삭제
router.post("/book/delete", async (req, res) => {
	const key = req.body.ISBN_origin;

	const result = await deleteSql.deleteBook(key);

	if (result.success === true) {
		res.send(`<script>
			alert('삭제 성공!');
			location.href='/admin/book/';
		</script>`);
	} else {
		res.send(`<script>
			alert('삭제 실패! error:${result.error}');
			location.href='/admin/book/';
		</script>`);
	}
});
//수정
router.post("/book/update", async (req, res) => {
	const data = req.body;

	const result = await updateSql.updateBook(data);

	if (result.success === true) {
		res.send(`<script>
			alert('수정 성공!');
			location.href='/admin/book/';
		</script>`);
	} else {
		res.send(`<script>
			alert('수정 실패! error:${result.error}');
			location.href='/admin/book/';
		</script>`);
	}
});
// ----------------------------Author----------------------------
//보여주기
myRouter(router, "author");
// 추가
router.post("/author/insert", async (req, res) => {
	const input = req.body;
	const data = {
		Name: input.Name,
		URL: input.URL,
		Address: input.Address,
		ID: input.ID,
	};

	const result = await insertSql.insertAuthor(data);

	if (result.success === true) {
		res.send(`<script>
			alert('추가 성공!');
			location.href='/admin/author/';
		</script>`);
	} else {
		res.send(`<script>
			alert('추가 실패! error:${result.error}');
			location.href='/admin/author/';
		</script>`);
	}
});
//삭제
router.post("/author/delete", async (req, res) => {
	const key = req.body.ID_origin;

	const result = await deleteSql.deleteAuthor(key);

	if (result.success === true) {
		res.send(`<script>
			alert('삭제 성공!');
			location.href='/admin/author/';
		</script>`);
	} else {
		res.send(`<script>
			alert('삭제 실패! error:${result.error}');
			location.href='/admin/author/';
		</script>`);
	}
});
//수정
router.post("/author/update", async (req, res) => {
	const data = req.body;
	console.log("update :", data);

	const result = await updateSql.updateAuthor(data);

	if (result.success === true) {
		res.send(`<script>
			alert('수정 성공!');
			location.href='/admin/author/';
		</script>`);
	} else {
		res.send(`<script>
			alert('수정 실패! error:${result.error}');
			location.href='/admin/author/';
		</script>`);
	}
});
// ----------------------------Award----------------------------
//보여주기
myRouter(router, "award");
// 추가
router.post("/award/insert", async (req, res) => {
	const input = req.body;
	const data = {
		Name: input.Name,
		Year: input.Year,
		ID: input.ID,
	};

	const result = await insertSql.insertAward(data);

	if (result.success === true) {
		res.send(`<script>
			alert('추가 성공!');
			location.href='/admin/award/';
		</script>`);
	} else {
		res.send(`<script>
			alert('추가 실패! error:${result.error}');
			location.href='/admin/award/';
		</script>`);
	}
});
//삭제
router.post("/award/delete", async (req, res) => {
	const key = req.body.ID_origin;
	console.log("delete :", key);

	const result = await deleteSql.deleteAward(key);

	if (result.success === true) {
		res.send(`<script>
			alert('삭제 성공!');
			location.href='/admin/award/';
		</script>`);
	} else {
		res.send(`<script>
			alert('삭제 실패! error:${result.error}');
			location.href='/admin/award/';
		</script>`);
	}
});
//수정
router.post("/award/update", async (req, res) => {
	const data = req.body;
	console.log("update :", data);

	const result = await updateSql.updateAward(data);

	if (result.success === true) {
		res.send(`<script>
			alert('수정 성공!');
			location.href='/admin/award/';
		</script>`);
	} else {
		res.send(`<script>
			alert('수정 실패! error:${result.error}');
			location.href='/admin/award/';
		</script>`);
	}
});
// ----------------------------Warehouse----------------------------
//보여주기
myRouter(router, "warehouse");
// 추가
router.post("/warehouse/insert", async (req, res) => {
	const input = req.body;
	const data = {
		Code: input.Code,
		Phone: input.Phone,
		Address: input.Address,
	};

	const result = await insertSql.insertWarehouse(data);

	if (result.success === true) {
		res.send(`<script>
			alert('추가 성공!');
			location.href='/admin/warehouse/';
		</script>`);
	} else {
		res.send(`<script>
			alert('추가 실패! error:${result.error}');
			location.href='/admin/warehouse/';
		</script>`);
	}
});
//삭제
router.post("/warehouse/delete", async (req, res) => {
	const key = req.body.Code_origin;
	console.log("delete :", key);

	const result = await deleteSql.deleteWarehouse(key);

	if (result.success === true) {
		res.send(`<script>
			alert('삭제 성공!');
			location.href='/admin/warehouse/';
		</script>`);
	} else {
		res.send(`<script>
			alert('삭제 실패! error:${result.error}');
			location.href='/admin/warehouse/';
		</script>`);
	}
});
//수정
router.post("/warehouse/update", async (req, res) => {
	const data = req.body;
	console.log("update :", data);

	const result = await updateSql.updateWarehouse(data);

	if (result.success === true) {
		res.send(`<script>
			alert('수정 성공!');
			location.href='/admin/warehouse/';
		</script>`);
	} else {
		res.send(`<script>
			alert('수정 실패! error:${result.error}');
			location.href='/admin/warehouse/';
		</script>`);
	}
});
// ----------------------------Reservation----------------------------
//보여주기
myRouter(router, "reservation");
// 추가
router.post("/reservation/insert", async (req, res) => {
	const input = req.body;
	const data = {
		Book_ISBN: input.Book_ISBN,
		Customer_Email: input.Customer_Email,
		ID: input.ID,
		Reservation_date: input.Reservation_date,
		Pickup_time: input.Pickup_time,
		Number: input.Number,
	};

	const result = await insertSql.insertReservation(data);

	if (result.success === true) {
		res.send(`<script>
			alert('추가 성공!');
			location.href='/admin/reservation/';
		</script>`);
	} else {
		res.send(`<script>
			alert('추가 실패! error:${result.error}');
			location.href='/admin/reservation/';
		</script>`);
	}
});
//삭제
router.post("/reservation/delete", async (req, res) => {
	const input = req.body;
	const data = {
		ID: input.ID_origin,
		Book_ISBN: input.Book_ISBN,
		Number: input.Number,
	};

	const result = await deleteSql.deleteReservation(data);

	if (result.success === true) {
		res.send(`<script>
			alert('삭제 성공!');
			location.href='/admin/reservation/';
		</script>`);
	} else {
		res.send(`<script>
			alert('삭제 실패! error:${result.error}');
			location.href='/admin/reservation/';
		</script>`);
	}
});
//수정
router.post("/reservation/update", async (req, res) => {
	const data = req.body;
	console.log("update :", data);

	const result = await updateSql.updateReservation(data);

	if (result.success === true) {
		res.send(`<script>
			alert('수정 성공!');
			location.href='/admin/reservation/';
		</script>`);
	} else {
		res.send(`<script>
			alert('수정 실패! error:${result.error}');
			location.href='/admin/reservation/';
		</script>`);
	}
});
// ----------------------------Shopping_basket & Contains----------------------------
//보여주기
myRouter(router, "shoppingBasket");
// 추가
router.post("/shoppingBasket/insert", async (req, res) => {
	const input = req.body;
	const data = {
		BasketID: input.BasketID,
		Order_date: input.Order_date,
		Customer_Email: input.Customer_Email,
		Book_ISBN: input.Book_ISBN,
		Number: input.Number,
	};

	const result = await insertSql.insertShoppingBasket(data);

	if (result.success === true) {
		res.send(`<script>
			alert('추가 성공!');
			location.href='/admin/shoppingBasket/';
		</script>`);
	} else {
		res.send(`<script>
			alert('추가 실패! error:${result.error}');
			location.href='/admin/shoppingBasket/';
		</script>`);
	}
});
//삭제
router.post("/shoppingBasket/delete", async (req, res) => {
	const input = req.body;
	const data = {
		BasketID: input.BasketID_origin,
		Book_ISBN: input.Book_ISBN,
		Number: input.Number,
	};

	const result = await deleteSql.deleteShoppingBasket(data);

	if (result.success === true) {
		res.send(`<script>
			alert('삭제 성공!');
			location.href='/admin/shoppingBasket/';
		</script>`);
	} else {
		res.send(`<script>
			alert('삭제 실패! error:${result.error}');
			location.href='/admin/shoppingBasket/';
		</script>`);
	}
});
//수정
router.post("/shoppingBasket/update", async (req, res) => {
	const data = req.body;
	console.log("update :", data);

	const result = await updateSql.updateShoppingBasket(data);

	if (result.success === true) {
		res.send(`<script>
			alert('수정 성공!');
			location.href='/admin/shoppingBasket/';
		</script>`);
	} else {
		res.send(`<script>
			alert('수정 실패! error:${result.error}');
			location.href='/admin/shoppingBasket/';
		</script>`);
	}
});
// ----------------------------Inventory----------------------------
//보여주기
myRouter(router, "inventory");
// 추가
router.post("/inventory/insert", async (req, res) => {
	const input = req.body;
	const data = {
		Warehouse_Code: input.Warehouse_Code,
		Book_ISBN: input.Book_ISBN,
		Number: input.Number,
	};

	const result = await insertSql.insertInventory(data);

	if (result.success === true) {
		res.send(`<script>
			alert('추가 성공!');
			location.href='/admin/inventory/';
		</script>`);
	} else {
		res.send(`<script>
			alert('추가 실패! error:${result.error}');
			location.href='/admin/inventory/';
		</script>`);
	}
});
//삭제
router.post("/inventory/delete", async (req, res) => {
	const key = {
		Warehouse_Code: req.body.Warehouse_Code_origin,
		Book_ISBN: req.body.Book_ISBN_origin,
	};
	console.log("delete :", key);

	const result = await deleteSql.deleteInventory(key);

	if (result.success === true) {
		res.send(`<script>
			alert('삭제 성공!');
			location.href='/admin/inventory/';
		</script>`);
	} else {
		res.send(`<script>
			alert('삭제 실패! error:${result.error}');
			location.href='/admin/inventory/';
		</script>`);
	}
});
//수정
router.post("/inventory/update", async (req, res) => {
	const data = req.body;
	console.log("update :", data);

	const result = await updateSql.updateInventory(data);

	if (result.success === true) {
		res.send(`<script>
			alert('수정 성공!');
			location.href='/admin/inventory/';
		</script>`);
	} else {
		res.send(`<script>
			alert('수정 실패! error:${result.error}');
			location.href='/admin/inventory/';
		</script>`);
	}
});
// ----------------------------Author_has_Award----------------------------
//보여주기
myRouter(router, "authorHasAward");
// 추가
router.post("/authorHasAward/insert", async (req, res) => {
	const input = req.body;
	const data = {
		Author_ID: input.Author_ID,
		Award_ID: input.Award_ID,
	};

	const result = await insertSql.insertAuthorHasAward(data);

	if (result.success === true) {
		res.send(`<script>
			alert('추가 성공!');
			location.href='/admin/authorHasAward/';
		</script>`);
	} else {
		res.send(`<script>
			alert('추가 실패! error:${result.error}');
			location.href='/admin/authorHasAward/';
		</script>`);
	}
});
//삭제
router.post("/authorHasAward/delete", async (req, res) => {
	const key = {
		Author_ID: req.body.Author_ID_origin,
		Award_ID: req.body.Award_ID_origin,
	};
	console.log("delete :", key);

	const result = await deleteSql.deleteAuthorHasAward(key);

	if (result.success === true) {
		res.send(`<script>
			alert('삭제 성공!');
			location.href='/admin/authorHasAward/';
		</script>`);
	} else {
		res.send(`<script>
			alert('삭제 실패! error:${result.error}');
			location.href='/admin/authorHasAward/';
		</script>`);
	}
});
//수정
router.post("/authorHasAward/update", async (req, res) => {
	const data = req.body;
	console.log("update :", data);

	const result = await updateSql.updateAuthorHasAward(data);

	if (result.success === true) {
		res.send(`<script>
			alert('수정 성공!');
			location.href='/admin/authorHasAward/';
		</script>`);
	} else {
		res.send(`<script>
			alert('수정 실패! error:${result.error}');
			location.href='/admin/authorHasAward/';
		</script>`);
	}
});
// ----------------------------Award_has_Book----------------------------
//보여주기
myRouter(router, "awardHasBook");
// 추가
router.post("/awardHasBook/insert", async (req, res) => {
	const input = req.body;
	const data = {
		Award_ID: input.Award_ID,
		Book_ISBN: input.Book_ISBN,
	};

	const result = await insertSql.insertAwardHasBook(data);

	if (result.success === true) {
		res.send(`<script>
			alert('추가 성공!');
			location.href='/admin/awardHasBook/';
		</script>`);
	} else {
		res.send(`<script>
			alert('추가 실패! error:${result.error}');
			location.href='/admin/awardHasBook/';
		</script>`);
	}
});
//삭제
router.post("/awardHasBook/delete", async (req, res) => {
	const key = {
		Award_ID: req.body.Award_ID_origin,
		Book_ISBN: req.body.Book_ISBN_origin,
	};
	console.log("delete :", key);

	const result = await deleteSql.deleteAwardHasBook(key);

	if (result.success === true) {
		res.send(`<script>
			alert('삭제 성공!');
			location.href='/admin/awardHasBook/';
		</script>`);
	} else {
		res.send(`<script>
			alert('삭제 실패! error:${result.error}');
			location.href='/admin/awardHasBook/';
		</script>`);
	}
});
//수정
router.post("/awardHasBook/update", async (req, res) => {
	const data = req.body;
	console.log("update :", data);

	const result = await updateSql.updateAwardHasBook(data);

	if (result.success === true) {
		res.send(`<script>
			alert('수정 성공!');
			location.href='/admin/awardHasBook/';
		</script>`);
	} else {
		res.send(`<script>
			alert('수정 실패! error:${result.error}');
			location.href='/admin/awardHasBook/';
		</script>`);
	}
});
module.exports = router;
