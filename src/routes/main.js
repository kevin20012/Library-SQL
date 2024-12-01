import express from "express";
import { selectSql } from "../database/userSql.js";

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

const getSearchInfoFromTable = async (option, query, req, res) => {
	try {
		// 클라이언트에서 page와 limit 요청 (기본값 설정)
		const page = parseInt(req.query.page) || 1; // 현재 페이지 번호 (기본값 1)
		const limit = parseInt(req.query.limit) || 30; // 페이지당 항목 수 (기본값 30)

		// OFFSET 계산
		const offset = (page - 1) * limit;

		let datas = [];
		let totalCountResult = [];

		// 데이터 가져오기, 총 데이터 개수 조회

		[datas, totalCountResult] = await selectSql.getSearch(
			option,
			query,
			limit,
			offset
		);
		console.log(datas, totalCountResult);

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
		if (query === "") {
			return;
		}

		const search_info = await getSearchInfoFromTable(
			option,
			query,
			req,
			res
		);
		const datas = search_info.data;

		const startPage =
			search_info.currentPage - (search_info.currentPage % 10) + 1;
		const endPage =
			search_info.currentPage - (search_info.currentPage % 10) + 1 + 9;
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
		console.log(datas);
		console.log("here!");
		if (pageInfo.totalPages < pageInfo.endPage)
			pageInfo.endPage = pageInfo.totalPages + 1;
		res.render("user_main", {
			user: {
				name: name[0].Name,
			},
			searchResults: datas,
			Page: range(pageInfo.startPage, pageInfo.endPage),
			pageInfo: pageInfo,
			option: option,
			query: query,
		});
	} else {
		res.redirect("/");
	}
});

module.exports = router;
