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

export const loginSql = {
	getLoginCustomer: async (id, pw) => {
		try {
			//sql parameter 바인딩을 사용해 sql injection을 방지
			const sql = `select * from Customer where Email=? and Password=?`;
			const [result] = await promisePool.query(sql, [id, pw]);
			return result;
		} catch (error) {
			console.log(error);
			return { success: false, error: error.message };
		}
	},
};
