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

//점검 완료
export const selectSql = {
	getCustomer: async (limit, offset) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select * from Customer where Email != 'admin' LIMIT ? OFFSET ? for update`;
			const sql2 = `select count(*) as totalCount from Customer where Email != 'admin' for update`;
			const [result] = await promisePool.query(sql, [limit, offset]);
			const [result2] = await promisePool.query(sql2);
			await promisePool.query(`commit;`);
			return [result, result2];
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	getBook: async (limit, offset) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select * from Book LIMIT ? OFFSET ? for update`;
			const sql2 = `select count(*) as totalCount from Book for update`;
			const [result] = await promisePool.query(sql, [limit, offset]);
			const [result2] = await promisePool.query(sql2);
			await promisePool.query(`commit;`);
			return [result, result2];
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	getAuthor: async (limit, offset) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select * from Author LIMIT ? OFFSET ? for update`;
			const sql2 = `select count(*) as totalCount from Author for update`;
			const [result] = await promisePool.query(sql, [limit, offset]);
			const [result2] = await promisePool.query(sql2);
			await promisePool.query(`commit;`);
			return [result, result2];
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	getAward: async (limit, offset) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select * from Award LIMIT ? OFFSET ? for update`;
			const sql2 = `select count(*) as totalCount from Award for update`;
			const [result] = await promisePool.query(sql, [limit, offset]);
			const [result2] = await promisePool.query(sql2);
			await promisePool.query(`commit;`);
			return [result, result2];
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	getWarehouse: async (limit, offset) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select * from Warehouse LIMIT ? OFFSET ? for update`;
			const sql2 = `select count(*) as totalCount from Warehouse for update`;
			const [result] = await promisePool.query(sql, [limit, offset]);
			const [result2] = await promisePool.query(sql2);
			await promisePool.query(`commit;`);
			return [result, result2];
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	getReservation: async (limit, offset) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select Book_ISBN, Customer_Email, ID, DATE_FORMAT(Reservation_date, '%Y-%m-%d %H:%i:%s') AS Reservation_date, DATE_FORMAT(Pickup_time, '%Y-%m-%d %H:%i:%s') AS Pickup_time from Reservation LIMIT ? OFFSET ? for update`;
			const sql2 = `select count(*) as totalCount from Reservation for update`;
			const [result] = await promisePool.query(sql, [limit, offset]);
			const [result2] = await promisePool.query(sql2);
			await promisePool.query(`commit;`);
			return [result, result2];
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	getShoppingBasket: async (limit, offset) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select BasketID, DATE_FORMAT(Order_date, '%Y-%m-%d %H:%i:%s') AS Order_date, Customer_Email from Shopping_basket LIMIT ? OFFSET ? for update`;
			const sql2 = `select count(*) as totalCount from Shopping_basket for update`;
			const [result] = await promisePool.query(sql, [limit, offset]);
			const [result2] = await promisePool.query(sql2);
			await promisePool.query(`commit;`);
			return [result, result2];
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	getInventory: async (limit, offset) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select * from Inventory LIMIT ? OFFSET ? for update`;
			const sql2 = `select count(*) as totalCount from Inventory for update`;
			const [result] = await promisePool.query(sql, [limit, offset]);
			const [result2] = await promisePool.query(sql2);
			await promisePool.query(`commit;`);
			return [result, result2];
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	getAuthorHasAward: async (limit, offset) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select * from Author_has_Award LIMIT ? OFFSET ? for update`;
			const sql2 = `select count(*) as totalCount from Author_has_Award for update`;
			const [result] = await promisePool.query(sql, [limit, offset]);
			const [result2] = await promisePool.query(sql2);
			await promisePool.query(`commit;`);
			return [result, result2];
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
	getAwardHasBook: async (limit, offset) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select * from Award_has_Book LIMIT ? OFFSET ? for update`;
			const sql2 = `select count(*) as totalCount from Award_has_Book for update`;
			const [result] = await promisePool.query(sql, [limit, offset]);
			const [result2] = await promisePool.query(sql2);
			await promisePool.query(`commit;`);
			return [result, result2];
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error);
			return { success: false, error: error.message };
		}
	},
};

export const insertSql = {
	//점검 완료
	insertCustomer: async (data) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			const check_sql = `select count(*) as totalCount from Customer where email=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.email,
			]);

			if (checkResult[0].totalCount === 0) {
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
			} else {
				await promisePool.query(`commit;`);
				throw new Error(`Already exist error!`);
			}
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
	//점검 완료
	insertBook: async (data) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			//이미 존재하는 isbn인지를 체크
			const check_sql = `select count(*) as totalCount from Book where ISBN=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.ISBN,
			]);
			//작가의 id가 존재하는지 확인
			const check_sql2 = `select count(*) as totalCount from Author where Author_ID=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.Author_ID,
			]);

			if (checkResult[0].totalCount !== 0) {
				throw new Error(`같은 ISBN을 가진 책이 존재합니다!`);
			}
			if (checkResult2[0].totalCount === 0) {
				throw new Error(`존재하지 않는 Author_ID입니다!`);
			}
			if (
				checkResult[0].totalCount === 0 &&
				checkResult2[0].totalCount !== 0
			) {
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
			} else {
				throw new Error(`추가 실패!`);
			}
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
	//점검 완료
	insertAuthor: async (data) => {
		try {
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

			if (checkResult[0].totalCount === 0) {
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
			} else {
				throw new Error(`추가 실패!`);
			}
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
	//점검 완료
	insertAward: async (data) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			//이미 존재하는 isbn인지를 체크
			const check_sql = `select count(*) as totalCount from Award where ID=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [data.ID]);

			if (checkResult[0].totalCount !== 0) {
				throw new Error(`같은 ID를 가진 상이 존재합니다!`);
			}

			if (checkResult[0].totalCount === 0) {
				//execute
				const sql = `INSERT INTO Award (Name, Year, ID) VALUES (?,?,?)`;
				const [result] = await promisePool.query(sql, [
					data.Name,
					data.Year,
					data.ID,
				]);
				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`추가 실패!`);
			}
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
	//점검 완료
	insertWarehouse: async (data) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			//이미 존재하는 isbn인지를 체크
			const check_sql = `select count(*) as totalCount from Warehouse where Code=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.Code,
			]);

			if (checkResult[0].totalCount !== 0) {
				throw new Error(`같은 Code를 가진 창고가 존재합니다!`);
			}

			if (checkResult[0].totalCount === 0) {
				//execute
				const sql = `INSERT INTO Warehouse (Code, Phone, Address) VALUES (?,?,?)`;
				const [result] = await promisePool.query(sql, [
					data.Code,
					data.Phone,
					data.Address,
				]);
				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`추가 실패!`);
			}
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error.message);
			return { success: false, error: error.message };
		}
	},
	/* 
        reservation insert 시 고려사항
        - 같은 key 존재 여부 확인
    */
	//점검 완료
	insertReservation: async (data) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			//이미 존재하는 key인지 체크
			const check_sql = `select count(*) as totalCount from Reservation where ID = ? for update`;
			const [checkResult] = await promisePool.query(check_sql, [data.ID]);
			//check2
			const check_sql2 = `select count(*) as totalCount from Book where ISBN=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.Book_ISBN,
			]);
			//check3
			const check_sql3 = `select count(*) as totalCount from Customer where Email=? for update`;
			const [checkResult3] = await promisePool.query(check_sql3, [
				data.Customer_Email,
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

			if (
				checkResult[0].totalCount === 0 &&
				checkResult2[0].totalCount !== 0 &&
				checkResult3[0].totalCount !== 0
			) {
				//execute
				const sql = `INSERT INTO Reservation (Book_ISBN, Customer_Email, ID, Reservation_date, Pickup_time) VALUES (?,?,?,?,?)`;
				const [result] = await promisePool.query(sql, [
					data.Book_ISBN,
					data.Customer_Email,
					data.ID,
					data.Reservation_date,
					data.Pickup_time,
				]);
				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`추가 실패!`);
			}
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error.message);
			return { success: false, error: error.message };
		}
	},
	/* 
        Shopping_basket insert 시 고려사항
        - 같은 key 존재 여부 확인
    */
	//점검 완료
	insertShoppingBasket: async (data) => {
		try {
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

			if (checkResult[0].totalCount !== 0) {
				throw new Error(`같은 BasketID를 가진 장바구니가 존재합니다!`);
			}
			if (checkResult2[0].totalCount === 0) {
				throw new Error(`추가하고자 하는 구매자가 존재하지 않습니다!`);
			}

			if (
				checkResult[0].totalCount === 0 &&
				checkResult2[0].totalCount !== 0
			) {
				//execute
				const sql = `INSERT INTO Shopping_basket (BasketID, Order_date, Customer_Email) VALUES (?,?,?)`;
				const [result] = await promisePool.query(sql, [
					data.BasketID,
					data.Order_date,
					data.Customer_Email,
				]);
				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`추가 실패!`);
			}
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
	//점검 완료
	insertInventory: async (data) => {
		try {
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

			if (
				checkResult[0].totalCount === 0 &&
				checkResult2[0].totalCount !== 0 &&
				checkResult3[0].totalCount !== 0
			) {
				//execute
				const sql = `INSERT INTO Inventory (Warehouse_Code, Book_ISBN, Number) VALUES (?,?,?)`;
				const [result] = await promisePool.query(sql, [
					data.Warehouse_Code,
					data.Book_ISBN,
					data.Number,
				]);
				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`추가 실패!`);
			}
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
	//점검 완료
	insertAuthorHasAward: async (data) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			//이미 존재하는 key인지 체크
			const check_sql = `select count(*) as totalCount from Author_has_Award where Author_ID = ? and Award_ID = ? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.Author_ID,
				data.Award_ID,
			]);
			//check2
			const check_sql2 = `select count(*) as totalCount from Author where ID=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.Author_ID,
			]);
			//check2
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

			if (
				checkResult[0].totalCount === 0 &&
				checkResult2[0].totalCount !== 0 &&
				checkResult3[0].totalCount !== 0
			) {
				//execute
				const sql = `INSERT INTO Author_has_Award (Author_ID, Award_ID) VALUES (?,?)`;
				const [result] = await promisePool.query(sql, [
					data.Author_ID,
					data.Award_ID,
				]);
				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`추가 실패!`);
			}
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
	//점검 완료
	insertAwardHasBook: async (data) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			//이미 존재하는 key인지 체크
			const check_sql = `select count(*) as totalCount from Award_has_Book where Award_ID = ? and Book_ISBN=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.Award_ID,
				data.Book_ISBN,
			]);
			//check2
			const check_sql2 = `select count(*) as totalCount from Award where ID=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.Award_ID,
			]);
			//check2
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

			if (
				checkResult[0].totalCount === 0 &&
				checkResult2[0].totalCount !== 0 &&
				checkResult3[0].totalCount !== 0
			) {
				//execute
				const sql = `INSERT INTO Award_has_Book (Award_ID, Book_ISBN) VALUES (?,?)`;
				const [result] = await promisePool.query(sql, [
					data.Award_ID,
					data.Book_ISBN,
				]);
				await promisePool.query(`commit;`);
				return { success: true };
			} else {
				throw new Error(`추가 실패!`);
			}
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
	//점검 완료
	deleteCustomer: async (key) => {
		try {
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
	//점검완료
	deleteBook: async (key) => {
		try {
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
	//점검 완료
	deleteAuthor: async (key) => {
		try {
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
	//점검 완료
	deleteAward: async (key) => {
		try {
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
	//점검 완료
	deleteWarehouse: async (key) => {
		try {
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
        - 없음
    */
	//점검 완료
	deleteReservation: async (key) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			const check_sql = `select count(*) as totalCount from Reservation where ID=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [key]);

			if (checkResult[0].totalCount === 1) {
				//execute
				const sql = `delete from Reservation where ID=?`;
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
        Shopping_basket 삭제시 함께 고려해야할 사항
        - contains
    */
	//점검 완료
	deleteShoppingBasket: async (key) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			const check_sql = `select count(*) as totalCount from Shopping_basket where BasketID=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [key]);
			//check2
			const check_sql2 = `select count(*) as totalCount from Contains where Shopping_basket_BasketID=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [key]);

			if (checkResult[0].totalCount === 1) {
				if (checkResult2[0].totalCount > 0) {
					const sql2 = `delete from Contains where Shopping_basket_BasketID=?`;
					const [result2] = await promisePool.query(sql2, [key]);
				}
				//execute
				const sql = `delete from Shopping_basket where BasketID=?`;
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
        Inventory 삭제시 함께 고려해야할 사항
        - 없음
    */
	//점검 완료
	deleteInventory: async (key) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			const check_sql = `select count(*) as totalCount from Inventory where Warehouse_Code=? and Book_ISBN=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				key.Warehouse_Code_origin,
				key.Book_ISBN_origin,
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
	//점검 완료
	deleteAuthorHasAward: async (key) => {
		try {
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
	//점검 완료
	deleteAwardHasBook: async (key) => {
		try {
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
	//점검완료
	updateCustomer: async (data) => {
		try {
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
	//점검 완료
	updateBook: async (data) => {
		try {
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
	//점검 완료
	updateAuthor: async (data) => {
		try {
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
	//점검 완료
	updateAward: async (data) => {
		try {
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
	//점검 완료
	updateWarehouse: async (data) => {
		try {
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
	//점검 완료
	updateReservation: async (data) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check 변경하려는 id가 있는지 체크
			const check_sql = `select count(*) as totalCount from Reservation where ID=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.ID_modify,
			]);
			let flag = 0;
			if (data.ID_origin !== data.ID_modify) {
				flag = 0;
			} else {
				flag = 1;
			}
			if (checkResult[0].totalCount === flag) {
				//Reservation 수정
				const sql = `update Reservation set Book_ISBN=?, Customer_Email=?, ID=?, Reservation_date=?, Pickup_time=? where ID=?`;
				const [result] = await promisePool.query(sql, [
					data.Book_ISBN,
					data.Customer_Email,
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
	//점검 완료
	updateShoppingBasket: async (data) => {
		try {
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check 변경하려는 id가 있는지 체크
			const check_sql = `select count(*) as totalCount from Shopping_basket where BasketID=? for update`;
			const [checkResult] = await promisePool.query(check_sql, [
				data.BasketID_modify,
			]);
			let flag = 0;
			if (data.BasketID_origin !== data.BasketID_modify) {
				flag = 0;
			} else {
				flag = 1;
			}

			if (checkResult[0].totalCount === flag) {
				const sql = `update Shopping_basket set BasketID=?, Order_date=?, Customer_Email = ? where BasketID=?`;
				const [result] = await promisePool.query(sql, [
					data.BasketID_modify,
					data.Order_date,
					data.Customer_Email,
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
	//점검 완료
	updateInventory: async (data) => {
		try {
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
	//점검 완료
	updateAuthorHasAward: async (data) => {
		try {
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
	//점검 완료
	updateAwardHasBook: async (data) => {
		try {
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
