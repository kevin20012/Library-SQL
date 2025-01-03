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

/*
	=== Isolation level에 관하여... ===
	read빼고는 모든 insert, delete, update 작업은 모두 
	'관리자가 데이터를 수정 중에 다른 관리자가 동일한 데이터를 수정할 수 없어야한다.' 라는 요구사항에 따라 
	isoloation level을 모두 serializable로 설정하였습니다.
	=================================
*/
export const selectSql = {
	getCustomer: async (limit, offset) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select *, COUNT(*) OVER() AS totalCount from Customer where Email != 'admin' LIMIT ? OFFSET ? for update`;
			const [result] = await promisePool.query(sql, [limit, offset]);
			await promisePool.query(`commit;`);
			return [result];
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	getBook: async (limit, offset) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select *, COUNT(*) OVER() AS totalCount from Book LIMIT ? OFFSET ? for update`;
			const [result] = await promisePool.query(sql, [limit, offset]);
			await promisePool.query(`commit;`);
			return [result];
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	getAuthor: async (limit, offset) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select *, COUNT(*) OVER() AS totalCount from Author LIMIT ? OFFSET ? for update`;
			const [result] = await promisePool.query(sql, [limit, offset]);
			await promisePool.query(`commit;`);
			return [result];
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	getAward: async (limit, offset) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select *, COUNT(*) OVER() AS totalCount from Award LIMIT ? OFFSET ? for update`;
			const [result] = await promisePool.query(sql, [limit, offset]);
			await promisePool.query(`commit;`);
			return [result];
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	getWarehouse: async (limit, offset) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select *, COUNT(*) OVER() AS totalCount from Warehouse LIMIT ? OFFSET ? for update`;
			const [result] = await promisePool.query(sql, [limit, offset]);
			await promisePool.query(`commit;`);
			return [result];
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	getReservation: async (limit, offset) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select Book_ISBN, Customer_Email, ID, DATE_FORMAT(Reservation_date, '%Y-%m-%d %H:%i:%s') AS Reservation_date, DATE_FORMAT(Pickup_time, '%Y-%m-%d %H:%i:%s') AS Pickup_time, Number, COUNT(*) OVER() AS totalCount from Reservation LIMIT ? OFFSET ? for update`;
			const [result] = await promisePool.query(sql, [limit, offset]);
			await promisePool.query(`commit;`);
			return [result];
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	getShoppingBasket: async (limit, offset) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select s.BasketID, DATE_FORMAT(s.Order_date, '%Y-%m-%d %H:%i:%s') AS Order_date, s.Customer_Email, c.Book_ISBN, c.Number, COUNT(*) OVER() AS totalCount
			from Shopping_basket s
			LEFT JOIN Contains c ON s.BasketID = c.Shopping_basket_BasketID
			LIMIT ? OFFSET ? for update`;
			const [result] = await promisePool.query(sql, [limit, offset]);
			await promisePool.query(`commit;`);
			return [result];
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	getInventory: async (limit, offset) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select *, COUNT(*) OVER() AS totalCount from Inventory LIMIT ? OFFSET ? for update`;
			const [result] = await promisePool.query(sql, [limit, offset]);
			await promisePool.query(`commit;`);
			return [result];
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	getAuthorHasAward: async (limit, offset) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select *, COUNT(*) OVER() AS totalCount from Author_has_Award LIMIT ? OFFSET ? for update`;
			const [result] = await promisePool.query(sql, [limit, offset]);
			await promisePool.query(`commit;`);
			return [result];
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	getAwardHasBook: async (limit, offset) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select *, COUNT(*) OVER() AS totalCount from Award_has_Book LIMIT ? OFFSET ? for update`;
			const [result] = await promisePool.query(sql, [limit, offset]);
			await promisePool.query(`commit;`);
			return [result];
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
};

export const insertSql = {
	insertCustomer: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			const check_sql = `select count(*) as totalCount from Customer where email=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.email,
			]);

			if (checkResult[0].totalCount !== 0) {
				throw new Error(`Already exist error!`);
			}

			//execute
			const sql = `INSERT INTO Customer (Email, Phone, Address, Name, Role, Password) VALUES (?,?,?,?, 'Customer', ?)`;
			const [result] = await promisePool.query(sql, [
				data.email,
				data.phone,
				data.address,
				data.name,
				data.password,
			]);
			await promisePool.query(`commit;`);
			return { success: true };
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error.message);
			return { success: false, error: error.message };
		}
	},
	/* 
        book insert 시 고려사항
        - Author id 존재 여부
    */

	insertBook: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			//이미 존재하는 isbn인지를 체크
			const check_sql = `select count(*) as totalCount from Book where ISBN=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.ISBN,
			]);
			//작가의 id가 존재하는지 확인
			const check_sql2 = `select count(*) as totalCount from Author where ID=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.Author_ID,
			]);

			if (checkResult[0].totalCount !== 0) {
				throw new Error(`같은 ISBN을 가진 책이 존재합니다!`);
			}
			if (checkResult2[0].totalCount === 0) {
				throw new Error(`존재하지 않는 Author_ID입니다!`);
			}

			//execute
			const sql = `INSERT INTO Book (ISBN, Category, Price, Title, Year, Author_ID) VALUES (?,?,?,?,?,?)`;
			const [result] = await promisePool.query(sql, [
				data.ISBN,
				data.Category,
				data.Price,
				data.Title,
				data.Year,
				data.Author_ID,
			]);
			await promisePool.query(`commit;`);
			return { success: true };
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error.message);
			return { success: false, error: error.message };
		}
	},
	/* 
        Author insert 시 고려사항
        - 같은 id 존재 여부 확인
    */

	insertAuthor: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			//이미 존재하는 isbn인지를 체크
			const check_sql = `select count(*) as totalCount from Author where ID=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.ISBN,
			]);

			if (checkResult[0].totalCount !== 0) {
				throw new Error(`같은 ID를 가진 작가가 존재합니다!`);
			}

			//execute
			const sql = `INSERT INTO Author (Name, URL, Address, ID) VALUES (?,?,?,?)`;
			const [result] = await promisePool.query(sql, [
				data.Name,
				data.URL,
				data.Address,
				data.ID,
			]);
			await promisePool.query(`commit;`);
			return { success: true };
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error.message);
			return { success: false, error: error.message };
		}
	},
	/* 
        Award insert 시 고려사항
        - 같은 id 존재 여부 확인
    */

	insertAward: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			//이미 존재하는 isbn인지를 체크
			const check_sql = `select count(*) as totalCount from Award where ID=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [data.ID]);

			if (checkResult[0].totalCount !== 0) {
				throw new Error(`같은 ID를 가진 상이 존재합니다!`);
			}

			//execute
			const sql = `INSERT INTO Award (Name, Year, ID) VALUES (?,?,?)`;
			const [result] = await promisePool.query(sql, [
				data.Name,
				data.Year,
				data.ID,
			]);
			await promisePool.query(`commit;`);
			return { success: true };
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error.message);
			return { success: false, error: error.message };
		}
	},
	/* 
        Warehouse insert 시 고려사항
        - 같은 code 존재 여부 확인
    */

	insertWarehouse: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			//이미 존재하는 warehouse인지를 체크
			const check_sql = `select count(*) as totalCount from Warehouse where Code=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.Code,
			]);

			if (checkResult[0].totalCount !== 0) {
				throw new Error(`같은 Code를 가진 창고가 존재합니다!`);
			}

			//execute
			const sql = `INSERT INTO Warehouse (Code, Phone, Address) VALUES (?,?,?)`;
			const [result] = await promisePool.query(sql, [
				data.Code,
				data.Phone,
				data.Address,
			]);
			await promisePool.query(`commit;`);
			return { success: true };
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error.message);
			return { success: false, error: error.message };
		}
	},
	/* 
        reservation insert 시 고려사항
        - 같은 key 존재 여부 확인
		- inventory에서 책 빼오기
    */

	insertReservation: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			//이미 존재하는 key인지 체크
			const check_sql = `select count(*) as totalCount from Reservation where ID = ? for update`;
			const [checkResult] = await promisePool.query(check_sql, [data.ID]);
			//존재하는 책인지 체크
			const check_sql2 = `select count(*) as totalCount from Book where ISBN=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.Book_ISBN,
			]);
			//존재하는 customer인지 체크
			const check_sql3 = `select count(*) as totalCount from Customer where Email=? for update`;
			const [checkResult3] = await promisePool.query(check_sql3, [
				data.Customer_Email,
			]);
			//책의 수량이 충분한지 체크
			const check_sql4 = `select Warehouse_Code, Number from Inventory where Book_ISBN=? for update`;
			const [checkResult4] = await promisePool.query(check_sql4, [
				data.Book_ISBN,
			]);

			if (checkResult[0].totalCount !== 0) {
				throw new Error(`같은 책과 구매자를 가진 이력이 존재합니다!`);
			}
			if (checkResult2[0].totalCount === 0) {
				throw new Error(`추가하고자 하는 책이 존재하지 않습니다!`);
			}
			if (checkResult3[0].totalCount === 0) {
				throw new Error(`추가하고자 하는 구매자가 존재하지 않습니다!`);
			}
			let totalBookCount = 0;
			checkResult4.forEach((item) => {
				totalBookCount += item.Number;
			});
			if (totalBookCount < data.Number) {
				throw new Error(
					"추가하고자 하는 책의 수량만큼 창고에 책이 존재하지 않습니다!"
				);
			}
			//모든 warehouse를 순회하며 책을 개수만큼 제거함.
			let curBookCount = data.Number;
			let minusSql;
			let minusResult;
			for (const warehouse of checkResult4) {
				console.log(warehouse);
				console.log(curBookCount);
				if (warehouse.Number > curBookCount) {
					minusSql = `update inventory set Number = ? where Warehouse_Code=? and Book_ISBN=?`;
					[minusResult] = await promisePool.query(minusSql, [
						warehouse.Number - curBookCount,
						warehouse.Warehouse_Code,
						data.Book_ISBN,
					]);
					break;
				} else {
					minusSql = `update inventory set Number = ? where Warehouse_Code=? and Book_ISBN=?`;
					[minusResult] = await promisePool.query(minusSql, [
						0,
						warehouse.Warehouse_Code,
						data.Book_ISBN,
					]);
					curBookCount -= warehouse.Number;
				}
			}
			//execute
			const sql = `INSERT INTO Reservation (Book_ISBN, Customer_Email, ID, Reservation_date, Pickup_time, Number) VALUES (?,?,?,?,?,?)`;
			const [result] = await promisePool.query(sql, [
				data.Book_ISBN,
				data.Customer_Email,
				data.ID,
				data.Reservation_date,
				data.Pickup_time,
				data.Number,
			]);
			await promisePool.query(`commit;`);
			return { success: true };
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error.message);
			return { success: false, error: error.message };
		}
	},
	/* 
        Shopping_basket insert 시 고려사항
        - 같은 key 존재 여부 확인
		- inventory에서 책 빼오기
    */

	insertShoppingBasket: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			//이미 존재하는 key인지 체크
			const check_sql = `select count(*) as totalCount from Shopping_basket where BasketID = ? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.BasketID,
			]);
			//check2
			const check_sql2 = `select count(*) as totalCount from Customer where Email=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.Customer_Email,
			]);
			//책이 존재하는지 확인
			const check_sq3 = `select count(*) as totalCount from Book where ISBN = ? for update`;
			const [checkResult3] = await promisePool.query(check_sq3, [
				data.Book_ISBN,
			]);
			//책의 수량이 충분한지 체크
			const check_sql4 = `select Warehouse_Code, Number from Inventory where Book_ISBN=? for update`;
			const [checkResult4] = await promisePool.query(check_sql4, [
				data.Book_ISBN,
			]);

			if (checkResult[0].totalCount !== 0) {
				throw new Error(`같은 BasketID를 가진 장바구니가 존재합니다!`);
			}
			if (checkResult2[0].totalCount === 0) {
				throw new Error(`추가하고자 하는 구매자가 존재하지 않습니다!`);
			}
			if (checkResult3[0].totalCount === 0) {
				throw new Error(`추가하고자 하는 책이 존재하지 않습니다!`);
			}
			let totalBookCount = 0;
			checkResult4.forEach((item) => {
				totalBookCount += item.Number;
			});
			if (totalBookCount < data.Number) {
				throw new Error(
					"추가하고자 하는 책의 수량만큼 창고에 책이 존재하지 않습니다!"
				);
			}
			//모든 warehouse를 순회하며 책을 개수만큼 제거함.
			let curBookCount = data.Number;
			let minusSql;
			let minusResult;
			for (const warehouse of checkResult4) {
				console.log(warehouse);
				console.log(curBookCount);
				if (warehouse.Number > curBookCount) {
					minusSql = `update inventory set Number = ? where Warehouse_Code=? and Book_ISBN=?`;
					[minusResult] = await promisePool.query(minusSql, [
						warehouse.Number - curBookCount,
						warehouse.Warehouse_Code,
						data.Book_ISBN,
					]);
					break;
				} else {
					minusSql = `update inventory set Number = ? where Warehouse_Code=? and Book_ISBN=?`;
					[minusResult] = await promisePool.query(minusSql, [
						0,
						warehouse.Warehouse_Code,
						data.Book_ISBN,
					]);
					curBookCount -= warehouse.Number;
				}
			}

			//execute
			const sql = `INSERT INTO Shopping_basket (BasketID, Order_date, Customer_Email) VALUES (?,?,?)`;
			const [result] = await promisePool.query(sql, [
				data.BasketID,
				data.Order_date,
				data.Customer_Email,
			]);
			const sql2 = `INSERT INTO Contains (Book_ISBN, Shopping_basket_BasketID, Number) VALUES (?,?,?)`;
			const [result2] = await promisePool.query(sql2, [
				data.Book_ISBN,
				data.BasketID,
				data.Number,
			]);
			await promisePool.query(`commit;`);
			return { success: true };
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error.message);
			return { success: false, error: error.message };
		}
	},
	/* 
        Inventory insert 시 고려사항
        - 같은 key 존재 여부 확인
        - warehouse_code 실존여부
        - Book_ISBN 실존여부
    */

	insertInventory: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			//이미 존재하는 key인지 체크
			const check_sql = `select count(*) as totalCount from Inventory where Warehouse_Code = ? and Book_ISBN = ? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.Warehouse_Code,
				data.Book_ISBN,
			]);
			//check2
			const check_sql2 = `select count(*) as totalCount from Warehouse where Code=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.Warehouse_Code,
			]);
			//check2
			const check_sql3 = `select count(*) as totalCount from Book where ISBN=? for update`;
			const [checkResult3] = await promisePool.query(check_sql3, [
				data.Book_ISBN,
			]);

			if (checkResult[0].totalCount !== 0) {
				throw new Error(`이미 창고에 책이 존재합니다!`);
			}
			if (checkResult2[0].totalCount === 0) {
				throw new Error(
					`추가하고자 하는 Warehouse가 존재하지 않습니다!`
				);
			}
			if (checkResult3[0].totalCount === 0) {
				throw new Error(`추가하고자 하는 책이 존재하지 않습니다!`);
			}

			//execute
			const sql = `INSERT INTO Inventory (Warehouse_Code, Book_ISBN, Number) VALUES (?,?,?)`;
			const [result] = await promisePool.query(sql, [
				data.Warehouse_Code,
				data.Book_ISBN,
				data.Number,
			]);
			await promisePool.query(`commit;`);
			return { success: true };
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error.message);
			return { success: false, error: error.message };
		}
	},
	/* 
        Author_has_Award insert 시 고려사항
        - 같은 key 존재 여부 확인
    */

	insertAuthorHasAward: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			//이미 존재하는 key인지 체크
			const check_sql = `select count(*) as totalCount from Author_has_Award where Author_ID = ? and Award_ID = ? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.Author_ID,
				data.Award_ID,
			]);
			//존재하는 작가인지 체크
			const check_sql2 = `select count(*) as totalCount from Author where ID=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.Author_ID,
			]);
			//존재하는 상인지 체크
			const check_sql3 = `select count(*) as totalCount from Award where ID=? for update`;
			const [checkResult3] = await promisePool.query(check_sql3, [
				data.Award_ID,
			]);

			if (checkResult[0].totalCount !== 0) {
				throw new Error(`이미 해당 내역으로 수상이력이 존재합니다!`);
			}
			if (checkResult2[0].totalCount === 0) {
				throw new Error(`추가하고자 하는 작가가 존재하지 않습니다!`);
			}
			if (checkResult3[0].totalCount === 0) {
				throw new Error(`추가하고자 하는 상이 존재하지 않습니다!`);
			}

			//execute
			const sql = `INSERT INTO Author_has_Award (Author_ID, Award_ID) VALUES (?,?)`;
			const [result] = await promisePool.query(sql, [
				data.Author_ID,
				data.Award_ID,
			]);
			await promisePool.query(`commit;`);
			return { success: true };
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error.message);
			return { success: false, error: error.message };
		}
	},
	/* 
        Award_has_Book insert 시 고려사항
        - 같은 key 존재 여부 확인
    */

	insertAwardHasBook: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			//이미 존재하는 key인지 체크
			const check_sql = `select count(*) as totalCount from Award_has_Book where Award_ID = ? and Book_ISBN=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.Award_ID,
				data.Book_ISBN,
			]);
			//존재하는 상인지 체크
			const check_sql2 = `select count(*) as totalCount from Award where ID=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.Award_ID,
			]);
			//존재하는 책인지 체크
			const check_sql3 = `select count(*) as totalCount from Book where ISBN=? for update`;
			const [checkResult3] = await promisePool.query(check_sql3, [
				data.Book_ISBN,
			]);

			if (checkResult[0].totalCount !== 0) {
				throw new Error(`이미 해당 내역으로 수상이력이 존재합니다!`);
			}
			if (checkResult2[0].totalCount === 0) {
				throw new Error(`추가하고자 하는 상이 존재하지 않습니다!`);
			}
			if (checkResult3[0].totalCount === 0) {
				throw new Error(`추가하고자 하는 책이 존재하지 않습니다!`);
			}

			//execute
			const sql = `INSERT INTO Award_has_Book (Award_ID, Book_ISBN) VALUES (?,?)`;
			const [result] = await promisePool.query(sql, [
				data.Award_ID,
				data.Book_ISBN,
			]);
			await promisePool.query(`commit;`);
			return { success: true };
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error.message);
			return { success: false, error: error.message };
		}
	},
};

export const deleteSql = {
	/* 
        customer 삭제시 함께 고려해야할 사항
        -reservation
        -shopping_basket
    */

	deleteCustomer: async (key) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			const check_sql = `select count(*) as totalCount from Customer where email=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [key]);
			//check2
			const check_sql2 = `select count(*) as totalCount from Reservation where Customer_Email=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [key]);
			//check3
			const check_sql3 = `select count(*) as totalCount from Shopping_basket where Customer_Email=? for update`;
			const [checkResult3] = await promisePool.query(check_sql3, [key]);

			if (checkResult[0].totalCount === 1) {
				if (checkResult2[0].totalCount > 0) {
					//execute
					const sql2 = `delete from Reservation where Customer_Email = ?`;
					const [result2] = await promisePool.query(sql2, [key]);
				}
				if (checkResult3[0].totalCount > 0) {
					//execute
					const sql3 = `delete from Shopping_basket where Customer_Email = ?`;
					const [result3] = await promisePool.query(sql3, [key]);
				}
				//execute
				const sql = `delete from Customer where Email = ?`;
				const [result] = await promisePool.query(sql, [key]);
				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`There is no item to delete error!`);
			}
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	/* 
        book 삭제시 함께 고려해야할 사항
        -Award_has_Book
        -Inventory
        -Reservation
        -Contains
    */

	deleteBook: async (key) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			const check_sql = `select count(*) as totalCount from Book where ISBN=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [key]);
			//check2
			const check_sql2 = `select count(*) as totalCount from Award_has_Book where Book_ISBN=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [key]);
			//check3
			const check_sql3 = `select count(*) as totalCount from Inventory where Book_ISBN=? for update`;
			const [checkResult3] = await promisePool.query(check_sql3, [key]);
			//check4
			const check_sql4 = `select count(*) as totalCount from Reservation where Book_ISBN=? for update`;
			const [checkResult4] = await promisePool.query(check_sql4, [key]);
			//check5
			const check_sql5 = `select count(*) as totalCount from Contains where Book_ISBN=? for update`;
			const [checkResult5] = await promisePool.query(check_sql5, [key]);

			if (checkResult[0].totalCount === 1) {
				if (checkResult2[0].totalCount > 0) {
					//execute
					const sql2 = `delete from Award_has_Book where Book_ISBN = ?`;
					const [result2] = await promisePool.query(sql2, [key]);
				}
				if (checkResult3[0].totalCount > 0) {
					//execute
					const sql3 = `delete from Inventory where Book_ISBN = ?`;
					const [result3] = await promisePool.query(sql3, [key]);
				}
				if (checkResult4[0].totalCount > 0) {
					//execute
					const sql4 = `delete from Reservation where Book_ISBN = ?`;
					const [result4] = await promisePool.query(sql4, [key]);
				}
				if (checkResult5[0].totalCount > 0) {
					//execute
					const sql5 = `delete from Contains where Book_ISBN = ?`;
					const [result5] = await promisePool.query(sql5, [key]);
				}
				//execute
				const sql = `delete from Book where ISBN = ?`;
				const [result] = await promisePool.query(sql, [key]);
				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`There is no item to delete error!`);
			}
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	/* 
        author 삭제시 함께 고려해야할 사항
        -Book
        -Author_has_Award
    */

	deleteAuthor: async (key) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			const check_sql = `select count(*) as totalCount from Author where ID=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [key]);
			//check2
			const check_sql2 = `select count(*) as totalCount from Book where Author_ID=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [key]);
			//check3
			const check_sql3 = `select count(*) as totalCount from Author_has_Award where Author_ID=? for update`;
			const [checkResult3] = await promisePool.query(check_sql3, [key]);

			if (checkResult[0].totalCount === 1) {
				if (checkResult2[0].totalCount > 0) {
					//execute
					const sql2 = `select * from Book, Author where Book.Author_ID = Author.ID and Author.ID = ?`;
					const [result2] = await promisePool.query(sql2, [key]);

					for (let i = 0; i < result2.length; i++) {
						await deleteSql.deleteBook(result2[i].ISBN);
					}
				}
				if (checkResult3[0].totalCount > 0) {
					//execute
					const sql3 = `delete from Author_has_Award where Author_ID = ?`;
					const [result3] = await promisePool.query(sql3, [key]);
				}
				//execute
				const sql = `delete from Author where ID = ?`;
				const [result] = await promisePool.query(sql, [key]);
				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`There is no item to delete error!`);
			}
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	/* 
        award 삭제시 함께 고려해야할 사항
        -Author_has_Award
        -Award_has_Book
    */

	deleteAward: async (key) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			const check_sql = `select count(*) as totalCount from Award where ID=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [key]);
			//check2
			const check_sql2 = `select count(*) as totalCount from Author_has_Award where Award_ID=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [key]);
			//check3
			const check_sql3 = `select count(*) as totalCount from Award_has_Book where Award_ID=? for update`;
			const [checkResult3] = await promisePool.query(check_sql3, [key]);

			if (checkResult[0].totalCount === 1) {
				if (checkResult2[0].totalCount > 0) {
					//execute
					const sql2 = `delete from Author_has_Award where Award_ID = ?`;
					const [result2] = await promisePool.query(sql2, [key]);
				}
				if (checkResult3[0].totalCount > 0) {
					//execute
					const sql3 = `delete from Award_has_Book where Award_ID = ?`;
					const [result3] = await promisePool.query(sql3, [key]);
				}
				//execute
				const sql = `delete from Award where ID = ?`;
				const [result] = await promisePool.query(sql, [key]);
				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`There is no item to delete error!`);
			}
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	/* 
        warehouse 삭제시 함께 고려해야할 사항
        -Author_has_Award
        -Award_has_Book
    */

	deleteWarehouse: async (key) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			const check_sql = `select count(*) as totalCount from Warehouse where Code=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [key]);
			//check2
			const check_sql2 = `select count(*) as totalCount from Inventory where Warehouse_Code=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [key]);

			if (checkResult[0].totalCount === 1) {
				if (checkResult2[0].totalCount > 0) {
					//execute
					const sql2 = `delete from Inventory where Warehouse_Code = ?`;
					const [result2] = await promisePool.query(sql2, [key]);
				}
				//execute
				const sql = `delete from Warehouse where Code = ?`;
				const [result] = await promisePool.query(sql, [key]);
				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`There is no item to delete error!`);
			}
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	/* 
        Reservation 삭제시 함께 고려해야할 사항
        - 창고에 책 다시 돌려놓기
    */

	deleteReservation: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			const check_sql = `select count(*) as totalCount from Reservation where ID=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [data.ID]);
			//해당 책이 있던 창고 알아오기
			const check_sql2 = `select Warehouse_Code, Number from inventory where Book_ISBN=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.Book_ISBN,
			]);

			if (checkResult[0].totalCount === 1) {
				//창고로 책 되돌려 놓기
				const pickOneWare =
					checkResult2[
						Math.floor(Math.random() * checkResult2.length)
					];
				const sql = `update inventory set Number=? where Warehouse_Code=? and Book_ISBN=?`;
				const [result] = await promisePool.query(sql, [
					Number(pickOneWare.Number) + Number(data.Number),
					pickOneWare.Warehouse_Code,
					data.Book_ISBN,
				]);
				//execute
				const sql2 = `delete from Reservation where ID=?`;
				const [result2] = await promisePool.query(sql2, [data.ID]);
				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`There is no item to delete error!`);
			}
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	/* 
        Shopping_basket 삭제시 함께 고려해야할 사항
        - contains
		- 창고에 책 다시 놀려놓기
    */

	deleteShoppingBasket: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			const check_sql = `select count(*) as totalCount from Shopping_basket where BasketID=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.BasketID,
			]);
			//check2
			const check_sql2 = `select count(*) as totalCount from Contains where Shopping_basket_BasketID=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.BasketID,
			]);
			//해당 책이 있던 창고 알아오기
			const check_sql3 = `select Warehouse_Code, Number from inventory where Book_ISBN=? for update`;
			const [checkResult3] = await promisePool.query(check_sql3, [
				data.Book_ISBN,
			]);

			if (checkResult[0].totalCount === 1) {
				//창고로 책 되돌려 놓기
				const pickOneWare =
					checkResult3[
						Math.floor(Math.random() * checkResult3.length)
					];
				const sql = `update inventory set Number=? where Warehouse_Code=? and Book_ISBN=?`;
				const [result] = await promisePool.query(sql, [
					Number(pickOneWare.Number) + Number(data.Number),
					pickOneWare.Warehouse_Code,
					data.Book_ISBN,
				]);
				//Contain 지우기
				if (checkResult2[0].totalCount > 0) {
					const sql2 = `delete from Contains where Shopping_basket_BasketID=?`;
					const [result2] = await promisePool.query(sql2, [
						data.BasketID,
					]);
				}
				//Shopping_basket 지우기
				const sql3 = `delete from Shopping_basket where BasketID=?`;
				const [result3] = await promisePool.query(sql3, [
					data.BasketID,
				]);
				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`There is no item to delete error!`);
			}
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	/* 
        Inventory 삭제시 함께 고려해야할 사항
        - 없음
    */

	deleteInventory: async (key) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			const check_sql = `select count(*) as totalCount from Inventory where Warehouse_Code=? and Book_ISBN=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				key.Warehouse_Code,
				key.Book_ISBN,
			]);

			if (checkResult[0].totalCount === 1) {
				//execute
				const sql = `delete from Inventory where Warehouse_Code=? and Book_ISBN=?`;
				const [result] = await promisePool.query(sql, [
					key.Warehouse_Code,
					key.Book_ISBN,
				]);
				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`There is no item to delete error!`);
			}
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	/* 
        Author_has_Award 삭제시 함께 고려해야할 사항
        - 없음
    */

	deleteAuthorHasAward: async (key) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			const check_sql = `select count(*) as totalCount from Author_has_Award where Author_ID=? and Award_ID=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				key.Author_ID,
				key.Award_ID,
			]);

			if (checkResult[0].totalCount === 1) {
				//execute
				const sql = `delete from Author_has_Award where Author_ID=? and Award_ID=?`;
				const [result] = await promisePool.query(sql, [
					key.Author_ID,
					key.Award_ID,
				]);
				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`There is no item to delete error!`);
			}
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	/* 
        Award_has_Book 삭제시 함께 고려해야할 사항
        - 없음
    */

	deleteAwardHasBook: async (key) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			const check_sql = `select count(*) as totalCount from Award_has_Book where Award_ID=? and Book_ISBN=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				key.Award_ID,
				key.Book_ISBN,
			]);

			if (checkResult[0].totalCount === 1) {
				//execute
				const sql = `delete from Award_has_Book where Award_ID=? and Book_ISBN=?`;
				const [result] = await promisePool.query(sql, [
					key.Award_ID,
					key.Book_ISBN,
				]);
				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`There is no item to delete error!`);
			}
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
};
export const updateSql = {
	/* 
        customer 삭제시 함께 고려해야할 사항
        -reservation
        -shopping_basket
    */

	updateCustomer: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			const check_sql = `select count(*) as totalCount from Customer where email=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.email_modify,
			]);
			//check2
			const check_sql2 = `select count(*) as totalCount from Reservation where Customer_Email=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.email_origin,
			]);
			//check3
			const check_sql3 = `select count(*) as totalCount from Shopping_basket where Customer_Email=? for update`;
			const [checkResult3] = await promisePool.query(check_sql3, [
				data.email_origin,
			]);
			let flag = 0;
			if (data.email_origin !== data.email_modify) {
				flag = 0;
			} else {
				flag = 1;
			}

			if (checkResult[0].totalCount === flag) {
				//execute
				const sql = `update Customer set email = ?, phone = ?, address = ?, name = ? where Email = ?`;
				const [result] = await promisePool.query(sql, [
					data.email_modify,
					data.phone,
					data.address,
					data.name,
					data.email_origin,
				]);
				if (checkResult2[0].totalCount > 0) {
					//execute
					const sql2 = `update Reservation set Customer_Email = ? where Customer_Email = ?`;
					const [result2] = await promisePool.query(sql2, [
						data.email_modify,
						data.email_origin,
					]);
				}
				if (checkResult3[0].totalCount > 0) {
					//execute
					const sql3 = `update Shopping_basket set Customer_Email = ? where Customer_Email = ?`;
					const [result3] = await promisePool.query(sql3, [
						data.email_modify,
						data.email_origin,
					]);
				}
				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`There is no item to update error!`);
			}
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	/*
    book과 관계를 맺은 모든 테이블을 수정해주어야함
    - Author -> 변경하려는 작가 있는지 확인
    - Award_has_book
    - Inventory
    - Contains
    - Reservation
    */

	updateBook: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			const check_sql = `select count(*) as totalCount from Book where ISBN=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.ISBN_modify,
			]);
			//check2 - 변경하고자 하는 작가가 있는지 확인
			const check_sql2 = `select count(*) as totalCount from Author where ID=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.Author_ID,
			]);
			//check3
			const check_sql3 = `select count(*) as totalCount from Award_has_book where Book_ISBN=? for update`;
			const [checkResult3] = await promisePool.query(check_sql3, [
				data.ISBN_origin,
			]);
			//check4
			const check_sql4 = `select count(*) as totalCount from Inventory where Book_ISBN=? for update`;
			const [checkResult4] = await promisePool.query(check_sql4, [
				data.ISBN_origin,
			]);
			//check5
			const check_sql5 = `select count(*) as totalCount from Contains where Book_ISBN=? for update`;
			const [checkResult5] = await promisePool.query(check_sql5, [
				data.ISBN_origin,
			]);
			//check6
			const check_sql6 = `select count(*) as totalCount from Reservation where Book_ISBN=? for update`;
			const [checkResult6] = await promisePool.query(check_sql6, [
				data.ISBN_origin,
			]);
			let flag = 0;
			if (data.ISBN_origin !== data.ISBN_modify) {
				flag = 0;
			} else {
				flag = 1;
			}
			if (
				checkResult[0].totalCount === flag &&
				checkResult2[0].totalCount === 1
			) {
				//book update
				const sql = `update Book set ISBN = ?, Category = ?, Price = ? , Title = ?, Year = ?, Author_ID = ? where ISBN = ?`;
				const [result] = await promisePool.query(sql, [
					data.ISBN_modify,
					data.Category,
					data.Price,
					data.Title,
					data.Year,
					data.Author_ID,
					data.ISBN_origin,
				]);

				if (checkResult3[0].totalCount > 0) {
					//award_has_book 수정
					const sql3 = `update Award_has_Book set Book_ISBN = ? where Book_ISBN = ?`;
					const [result3] = await promisePool.query(sql3, [
						data.ISBN_modify,
						data.ISBN_origin,
					]);
				}
				if (checkResult4[0].totalCount > 0) {
					//Inventory 수정
					const sql4 = `update Inventory set Book_ISBN = ? where Book_ISBN = ?`;
					const [result4] = await promisePool.query(sql4, [
						data.ISBN_modify,
						data.ISBN_origin,
					]);
				}
				if (checkResult5[0].totalCount > 0) {
					//Contains 수정
					const sql5 = `update Contains set Book_ISBN = ? where Book_ISBN = ?`;
					const [result5] = await promisePool.query(sql5, [
						data.ISBN_modify,
						data.ISBN_origin,
					]);
				}
				if (checkResult6[0].totalCount > 0) {
					//Reservation 수정
					const sql6 = `update Reservation set Book_ISBN = ? where Book_ISBN = ?`;
					const [result6] = await promisePool.query(sql6, [
						data.ISBN_modify,
						data.ISBN_origin,
					]);
				}

				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`There is no item to update error!`);
			}
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	/*
        Author과 관계를 맺은 모든 테이블을 수정해주어야함
        -변경하고자하는 id 존재 여부
        -Book
        -Author_has_Award
    */

	updateAuthor: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			const check_sql = `select count(*) as totalCount from Author where ID=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.ID_modify,
			]);
			//check2
			const check_sql2 = `select count(*) as totalCount from Book where Author_ID=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.ID_origin,
			]);
			//check3
			const check_sql3 = `select count(*) as totalCount from Author_has_Award where Author_ID=? for update`;
			const [checkResult3] = await promisePool.query(check_sql3, [
				data.ID_origin,
			]);
			let flag = 0;
			if (data.ID_origin !== data.ID_modify) {
				flag = 0;
			} else {
				flag = 1;
			}
			if (checkResult[0].totalCount === flag) {
				const sql = `update Author set Name = ?, URL = ?, Address = ? , ID = ? where ID = ?`;
				const [result] = await promisePool.query(sql, [
					data.Name,
					data.URL,
					data.Address,
					data.ID_modify,
					data.ID_origin,
				]);

				if (checkResult2[0].totalCount > 0) {
					const sql2 = `update Book set Author_ID = ? where Author_ID = ?`;
					const [result2] = await promisePool.query(sql2, [
						data.ID_modify,
						data.ID_origin,
					]);
				}
				if (checkResult3[0].totalCount > 0) {
					const sql3 = `update Author_has_Award set Author_ID = ? where Author_ID = ?`;
					const [result3] = await promisePool.query(sql3, [
						data.ID_modify,
						data.ID_origin,
					]);
				}

				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`There is no item to update error!`);
			}
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	/*
        award 관계를 맺은 모든 테이블을 수정해주어야함
        -변경하고자하는 id 존재 여부
        -Author_has_Award
        -Award_has_Book
    */

	updateAward: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			const check_sql = `select count(*) as totalCount from Award where ID=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.ID_modify,
			]);
			//check2
			const check_sql2 = `select count(*) as totalCount from Author_has_Award where Award_ID=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.ID_origin,
			]);
			//check3
			const check_sql3 = `select count(*) as totalCount from Award_has_Book where Award_ID=? for update`;
			const [checkResult3] = await promisePool.query(check_sql3, [
				data.ID_modify,
			]);
			let flag = 0;
			if (data.ID_origin !== data.ID_modify) {
				flag = 0;
			} else {
				flag = 1;
			}
			if (checkResult[0].totalCount === flag) {
				//book update
				const sql = `update Award set Name = ?, Year = ?, ID = ? where ID = ?`;
				const [result] = await promisePool.query(sql, [
					data.Name,
					data.Year,
					data.ID_modify,
					data.ID_origin,
				]);

				if (checkResult2[0].totalCount > 0) {
					//award_has_book 수정
					const sql2 = `update Author_has_Award set Award_ID = ? where Award_ID = ?`;
					const [result2] = await promisePool.query(sql2, [
						data.ID_modify,
						data.ID_origin,
					]);
				}
				if (checkResult3[0].totalCount > 0) {
					//award_has_book 수정
					const sql3 = `update Award_has_Book set Award_ID = ? where Award_ID = ?`;
					const [result3] = await promisePool.query(sql3, [
						data.ID_modify,
						data.ID_origin,
					]);
				}

				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`There is no item to update error!`);
			}
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	/*
        warehouse 관계를 맺은 모든 테이블을 수정해주어야함
        -변경하고자하는 Code 존재 여부
        -inventory
    */

	updateWarehouse: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			const check_sql = `select count(*) as totalCount from Warehouse where Code=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.Code_modify,
			]);
			//check2
			const check_sql2 = `select count(*) as totalCount from Inventory where Warehouse_Code=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.Code_modify,
			]);
			let flag = 0;
			if (data.Code_origin !== data.Code_modify) {
				flag = 0;
			} else {
				flag = 1;
			}
			if (checkResult[0].totalCount === flag) {
				//warehouse 수정
				const sql = `update Warehouse set Code = ?, Phone = ?, Address = ? where Code = ?`;
				const [result] = await promisePool.query(sql, [
					data.Code_modify,
					data.Phone,
					data.Address,
					data.Code_origin,
				]);

				if (checkResult2[0].totalCount > 0) {
					//Inventory 수정
					const sql2 = `update Inventory set Warehouse_Code = ? where Warehouse_Code = ?`;
					const [result2] = await promisePool.query(sql2, [
						data.ID_modify,
						data.ID_origin,
					]);
				}

				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`There is no item to update error!`);
			}
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	/*
        Reservation 관계를 맺은 모든 테이블을 수정해주어야함
        - book
        - customer
    */

	updateReservation: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check 변경하려는 id가 있는지 체크
			const check_sql = `select count(*) as totalCount from Reservation where ID=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.ID_modify,
			]);
			//변경하려는 email 있는지 체크
			const check_sql2 = `select count(*) as totalCount from Customer where Email=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.Customer_Email_modify,
			]);

			let flag = 0;
			if (data.ID_origin !== data.ID_modify) {
				flag = 0;
			} else {
				flag = 1;
			}
			if (checkResult2[0].totalCount === 0) {
				throw new Error("변경하려고하는 customer가 없습니다!");
			}
			if (checkResult[0].totalCount === flag) {
				//Reservation 수정
				const sql = `update Reservation set Book_ISBN=?, Customer_Email=?, ID=?, Reservation_date=?, Pickup_time=? where ID=?`;
				const [result] = await promisePool.query(sql, [
					data.Book_ISBN,
					data.Customer_Email_modify,
					data.ID_modify,
					data.Reservation_date,
					data.Pickup_time,
					data.ID_origin,
				]);

				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`There is no item to update error!`);
			}
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	/*
        Shopping_basket 관계를 맺은 모든 테이블을 수정해주어야함
        - Contains
    */

	updateShoppingBasket: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//변경하려는 id가 있는지 체크
			const check_sql = `select count(*) as totalCount from Shopping_basket where BasketID=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.BasketID_modify,
			]);
			//변경하려는 email 있는지 체크
			const check_sql2 = `select count(*) as totalCount from Customer where Email=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.Customer_Email_modify,
			]);

			let flag = 0;
			if (data.BasketID_origin !== data.BasketID_modify) {
				flag = 0;
			} else {
				flag = 1;
			}

			if (checkResult[0].totalCount === 0) {
				throw new Error("변경하려고하는 장바구니가 없습니다!");
			}
			if (checkResult2[0].totalCount === 0) {
				throw new Error("변경하려고하는 customer가 없습니다!");
			}

			if (checkResult[0].totalCount === flag) {
				//Contains 수정
				const sql = `update Contains set Book_ISBN=?, Shopping_basket_BasketID=? where Shopping_basket_BasketID=?`;
				const [result] = await promisePool.query(sql, [
					data.Book_ISBN,
					data.BasketID_modify,
					data.BasketID_origin,
				]);
				//Shopping_basket 수정
				const sql2 = `update Shopping_basket set BasketID=?, Order_date=?, Customer_Email = ? where BasketID=?`;
				const [result2] = await promisePool.query(sql2, [
					data.BasketID_modify,
					data.Order_date_modify,
					data.Customer_Email_modify,
					data.BasketID_origin,
				]);

				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`There is no item to update error!`);
			}
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	/*
        Inventory 관계를 맺은 모든 테이블을 수정해주어야함
        - 변경하려는 warehouse 존재여부 확인
        - 변경하려는 book 존재 여부 확인
    */

	updateInventory: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check 변경하려는 id가 있는지 체크
			const check_sql = `select count(*) as totalCount from Inventory where Warehouse_Code=? and Book_ISBN=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.Warehouse_Code_modify,
				data.Book_ISBN_modify,
			]);
			//check 변경하려는 warehouse가 있는지 체크
			const check_sql2 = `select count(*) as totalCount from Warehouse where Code=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.Warehouse_Code_modify,
			]);
			//check 변경하려는 책이 있는지 체크
			const check_sql3 = `select count(*) as totalCount from Book where ISBN=? for update`;
			const [checkResult3] = await promisePool.query(check_sql3, [
				data.Book_ISBN_modify,
			]);

			if (checkResult2[0].totalCount === 0) {
				throw new Error(`해당 창고는 존재하지 않는 창고입니다.`);
			}
			if (checkResult3[0].totalCount === 0) {
				throw new Error(`해당 책은 존재하지 않는 책입니다.`);
			}

			const sql = `update Inventory set Warehouse_Code=?, Book_ISBN=?, Number = ? where Warehouse_Code=? and Book_ISBN=?`;
			const [result] = await promisePool.query(sql, [
				data.Warehouse_Code_modify,
				data.Book_ISBN_modify,
				data.Number,
				data.Warehouse_Code_origin,
				data.Book_ISBN_origin,
			]);

			await promisePool.query(`commit;`);
			return { success: true };
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	/*
        Author_has_Award 관계를 맺은 모든 테이블을 수정해주어야함
        - 변경하려는 Author 존재여부 확인
        - 변경하려는 Award 존재 여부 확인
    */

	updateAuthorHasAward: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check 변경하려는 id가 있는지 체크
			const check_sql = `select count(*) as totalCount from Author_has_Award where Author_ID=? and Award_ID=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.Author_ID_modify,
				data.Award_ID_modify,
			]);
			//check 변경하려는 author가 있는지 체크
			const check_sql2 = `select count(*) as totalCount from Author where ID=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.Author_ID_modify,
			]);
			//check 변경하려는 award가 있는지 체크
			const check_sql3 = `select count(*) as totalCount from Award where ID=? for update`;
			const [checkResult3] = await promisePool.query(check_sql3, [
				data.Award_ID_modify,
			]);

			if (checkResult2[0].totalCount === 0) {
				throw new Error(`해당 작가는 존재하지 않는 작가입니다.`);
			}
			if (checkResult3[0].totalCount === 0) {
				throw new Error(`해당 상은 존재하지 않는 상입니다.`);
			}

			const sql = `update Author_has_Award set Author_ID=?, Award_ID=? where Author_ID=? and Award_ID=?`;
			const [result] = await promisePool.query(sql, [
				data.Author_ID_modify,
				data.Award_ID_modify,
				data.Author_ID_origin,
				data.Award_ID_origin,
			]);

			await promisePool.query(`commit;`);
			return { success: true };
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	/*
        Award_has_Book 관계를 맺은 모든 테이블을 수정해주어야함
        - 변경하려는 Author 존재여부 확인
        - 변경하려는 Award 존재 여부 확인
    */

	updateAwardHasBook: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check 변경하려는 id가 있는지 체크
			const check_sql = `select count(*) as totalCount from Award_has_Book where Award_ID=? and Book_ISBN=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.Award_ID_modify,
				data.Book_ISBN_modify,
			]);
			//check 변경하려는 Award가 있는지 체크
			const check_sql2 = `select count(*) as totalCount from Award where ID=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.Award_ID_modify,
			]);
			//check 변경하려는 Book이 있는지 체크
			const check_sql3 = `select count(*) as totalCount from Book where ISBN=? for update`;
			const [checkResult3] = await promisePool.query(check_sql3, [
				data.Book_ISBN_modify,
			]);

			if (checkResult2[0].totalCount === 0) {
				throw new Error(`해당 상은 존재하지 않는 상입니다.`);
			}
			if (checkResult3[0].totalCount === 0) {
				throw new Error(`해당 책은 존재하지 않는 책입니다.`);
			}

			const sql = `update Award_has_Book set Award_ID=?, Book_ISBN=?  where Award_ID=? and Book_ISBN=?`;
			const [result] = await promisePool.query(sql, [
				data.Award_ID_modify,
				data.Book_ISBN_modify,
				data.Award_ID_origin,
				data.Book_ISBN_origin,
			]);

			await promisePool.query(`commit;`);
			return { success: true };
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
};
