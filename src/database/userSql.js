import mysql from "mysql2";
import { format, subMinutes, addMinutes } from "date-fns";

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
			const sql = `select Name from Customer where Email= ? and Email != 'admin' for update`;

			const [result] = await promisePool.query(sql, [email]);
			return result;
		} catch (error) {
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	getSearch: async (option, query, limit, offset) => {
		try {
			let result = [];

			if (option == "book") {
				const sql = `SELECT 
                    b.ISBN AS ISBN, 
                    b.Category AS Category, 
                    MAX(aw.Name) AS Award,
                    b.Title AS Title, 
                    a.Name AS Author, 
                    b.Year, 
                    b.Price, 
                    SUM(COALESCE(i.Number, 0)) AS Quantity,
                    COUNT(*) OVER() AS totalCount
                FROM Book b
                LEFT JOIN Author a ON b.Author_ID = a.ID
                LEFT JOIN Award_has_Book ab ON b.ISBN = ab.Book_ISBN
                LEFT JOIN Award aw ON ab.Award_ID = aw.ID
                LEFT JOIN Inventory i ON i.Book_ISBN = b.ISBN
                WHERE b.Title LIKE CONCAT('%', ?, '%') 
                GROUP BY b.ISBN, b.Category, b.Title, a.Name, b.Year, b.Price LIMIT ? OFFSET ?`;

				[result] = await promisePool.query(sql, [query, limit, offset]);
			} else if (option === "author") {
				const sql = `SELECT b.ISBN AS ISBN, b.Category AS Category, MAX(aw.Name) AS Award, b.Title AS Title, a.Name AS Author, b.Year, b.Price, Sum(COALESCE(i.Number, 0)) AS Quantity, COUNT(*) OVER() AS totalCount
				FROM Book b
				JOIN Author a ON b.Author_ID = a.ID
                LEFT JOIN Award_has_Book ab ON b.ISBN = ab.Book_ISBN
				LEFT JOIN Award aw ON ab.Award_ID = aw.ID
                LEFT JOIN Inventory i ON i.Book_ISBN = b.ISBN
				WHERE a.Name LIKE CONCAT('%', ?, '%') GROUP BY b.ISBN, b.Category, b.Title, a.Name, b.Year, b.Price LIMIT ? OFFSET ?`;

				[result] = await promisePool.query(sql, [query, limit, offset]);
			} else if (option === "award") {
				const sql = `SELECT b.ISBN AS ISBN, b.Category AS Category, aw.Name AS Award, b.Title AS Title, a.Name AS Author, b.Year, b.Price, Sum(COALESCE(i.Number, 0)) AS Quantity, COUNT(*) OVER() AS totalCount
				FROM Book b
				JOIN Author a ON b.Author_ID = a.ID
                LEFT JOIN Award_has_Book ab ON b.ISBN = ab.Book_ISBN
				LEFT JOIN Award aw ON ab.Award_ID = aw.ID
                LEFT JOIN Inventory i ON i.Book_ISBN = b.ISBN
				WHERE aw.Name LIKE CONCAT('%', ?, '%') GROUP BY b.ISBN, b.Category, aw.Name, b.Title, a.Name, b.Year, b.Price LIMIT ? OFFSET ?`;

				[result] = await promisePool.query(sql, [query, limit, offset]);
			}

			return [result];
		} catch (error) {
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	getReservation: async (email, limit, offset) => {
		try {
			const sql = `select r.ID, r.Book_ISBN AS ISBN, b.Title AS Title, DATE_FORMAT(r.Reservation_date, '%Y-%m-%d %H:%i:%s') AS Reservation_date, DATE_FORMAT(r.Pickup_time, '%Y-%m-%d %H:%i:%s') AS Pickup_time, Count(*) OVER() AS totalCount
            from Reservation r
            JOIN Book b ON r.Book_ISBN = b.ISBN
            where r.Customer_Email= ? and r.Customer_Email != 'admin LIMIT ? OFFSET ?'`;
			const sql2 = `select count(*) AS totalCount from Reservation where Customer_Email= ? and Customer_Email != 'admin LIMIT ? OFFSET ?'`;

			const [result] = await promisePool.query(sql, [
				email,
				limit,
				offset,
			]);

			return [result];
		} catch (error) {
			console.log(error);
			return { success: false, error: error.message };
		}
	},
};

export const updateSql = {
	updatePickupTime: async (data) => {
		//다른 예약과 10분 차이 이상이 나는 경우에만 update 허용

		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);

			const pickUpDateTime = new Date(data.pickupTime.replace(" ", "T"));
			const tenMinuteBefore = new Date(
				pickUpDateTime.getTime() - 10 * 1000 * 60
			);
			const tenMinuteAfter = new Date(
				pickUpDateTime.getTime() + 10 * 1000 * 60
			);

			const checkTenMinSql = `select count(*) AS totalCount from Reservation where ID != ? and Pickup_time Between ? and ?`;
			const [checkResult] = await promisePool.query(checkTenMinSql, [
				data.id,
				format(tenMinuteBefore, "yyyy-MM-dd HH:mm:ss"),
				format(tenMinuteAfter, "yyyy-MM-dd HH:mm:ss"),
				,
			]);

			if (checkResult[0].totalCount > 0) {
				throw new Error(
					"10분 전후로 픽업 예약자가 존재해 해당 시간으로 예약 수정이 불가합니다!"
				);
			}

			const sql = `update Reservation set Pickup_time=? where ID=?`;
			const [result] = await promisePool.query(sql, [
				data.pickupTime,
				data.id,
			]);
			await promisePool.query(`commit;`);
			return { success: true };
		} catch (error) {
			await promisePool.query(`rollback;`);
			return { success: false, error: error.message };
		}
	},
};
