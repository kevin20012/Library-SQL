import mysql from "mysql2";

require("dotenv").config();

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME, //Term
});

const promisePool = pool.promise();

export const selectSql = {
	getName: async (email) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select Name from Customer where Email= ? and Email != 'admin' for update`;

			const [result] = await promisePool.query(sql, [email]);

			await promisePool.query(`commit;`);
			return result;
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	getSearch: async (option, query, limit, offset) => {
		try {
			let result = [];
			let result2 = [];
			if (option == "book") {
				const sql = `SELECT b.ISBN AS ISBN, b.Category AS Category, aw.Name AS Award, b.Title AS Title, a.Name AS Author, b.Year, b.Price
				FROM Book b
				JOIN Author a ON b.Author_ID = a.ID
                JOIN Award_has_Book ab ON b.ISBN = ab.Book_ISBN
				JOIN Award aw ON ab.Award_ID = aw.ID
				WHERE b.Title LIKE CONCAT('%', ?, '%') LIMIT ? OFFSET ?`;
				const sql2 = `Select Count(*) AS totalCount
				FROM Book b
				JOIN Author a ON b.Author_ID = a.ID
                JOIN Award_has_Book ab ON b.ISBN = ab.Book_ISBN
				JOIN Award aw ON ab.Award_ID = aw.ID
				WHERE b.Title LIKE CONCAT('%', ?, '%')`;

				[result] = await promisePool.query(sql, [query, limit, offset]);
				[result2] = await promisePool.query(sql2, [query]);
			} else if (option === "author") {
				const sql = `SELECT b.ISBN AS ISBN, b.Category AS Category, aw.Name AS Award, b.Title AS Title, a.Name AS Author, b.Year, b.Price
				FROM Book b
				JOIN Author a ON b.Author_ID = a.ID
                JOIN Award_has_Book ab ON b.ISBN = ab.Book_ISBN
				JOIN Award aw ON ab.Award_ID = aw.ID
				WHERE a.Name LIKE CONCAT('%', ?, '%') LIMIT ? OFFSET ?`;
				const sql2 = `Select Count(*) AS totalCount
				FROM Book b
				JOIN Author a ON b.Author_ID = a.ID
                JOIN Award_has_Book ab ON b.ISBN = ab.Book_ISBN
				JOIN Award aw ON ab.Award_ID = aw.ID
				WHERE a.Name LIKE CONCAT('%', ?, '%')`;

				[result] = await promisePool.query(sql, [query, limit, offset]);
				[result2] = await promisePool.query(sql2, [query]);
			} else if (option === "award") {
				const sql = `SELECT b.ISBN AS ISBN, b.Category AS Category, aw.Name AS Award, b.Title AS Title, a.Name AS Author, b.Year, b.Price
				FROM Book b
				JOIN Author a ON b.Author_ID = a.ID
                JOIN Award_has_Book ab ON b.ISBN = ab.Book_ISBN
				JOIN Award aw ON ab.Award_ID = aw.ID
				WHERE aw.Name LIKE CONCAT('%', ?, '%') LIMIT ? OFFSET ?`;
				const sql2 = `Select Count(*) AS totalCount
				FROM Book b
				JOIN Author a ON b.Author_ID = a.ID
                JOIN Award_has_Book ab ON b.ISBN = ab.Book_ISBN
				JOIN Award aw ON ab.Award_ID = aw.ID
				WHERE aw.Name LIKE CONCAT('%', ?, '%')`;
				[result] = await promisePool.query(sql, [query, limit, offset]);
				[result2] = await promisePool.query(sql2, [query]);
			}

			return [result, result2];
		} catch (error) {
			console.log(error);
			return { success: false, error: error.message };
		}
	},
};
