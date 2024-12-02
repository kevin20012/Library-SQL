import express from "express";
import { selectSql, updateSql } from "../database/userSql.js";

const hbs = require("hbs");

hbs.registerHelper("eq", (a, b) => a === b);

const router = express.Router();

let name = "";
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

		res.render("user_main", {
			user: {
				name: name[0].Name,
			},
			option: "book",
		});
	} else {
		res.redirect("/");
	}
});

const getInfoFromTable = async (arg, req, res) => {
	try {
		// 클라이언트에서 page와 limit 요청 (기본값 설정)
		const page = parseInt(req.query.page) || 1; // 현재 페이지 번호 (기본값 1)
		const limit = parseInt(req.query.limit) || 30; // 페이지당 항목 수 (기본값 30)

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
		}

		const totalCount = datas[0].totalCount;

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

router.get("/search", async (req, res) => {
	if (
		req.session.user !== undefined &&
		req.session.user.role === "Customer"
	) {
		let option = req.query.option;
		if (option === undefined) {
			option = "book";
		}
		let query = req.query.query;
		const arg = {
			type: "search",
			option: option,
			query: query,
		};

		const search_info = await getInfoFromTable(arg, req, res);
		const datas = search_info.data;

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
			prevPage = startPage - 2;
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
		console.log(pageInfo.totalPages);
		console.log(pageInfo.endPage);
		if (pageInfo.totalPages < pageInfo.endPage)
			pageInfo.endPage = pageInfo.totalPages;
		res.render("user_reservation", {
			user: {
				name: name[0].Name,
			},
			reservations: datas,
			Page: range(pageInfo.startPage, pageInfo.endPage),
			pageInfo: pageInfo,
		});
	} else {
		res.redirect("/");
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

module.exports = router;
