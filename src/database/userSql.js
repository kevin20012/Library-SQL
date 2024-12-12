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
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;`
			);
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
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;`
			);

			let result = [];

			if (option == "book") {
				const sql = `SELECT 
                    b.ISBN AS ISBN, 
                    b.Category AS Category, 
                    IFNULL(GROUP_CONCAT(DISTINCT aw.Name ORDER BY aw.Name SEPARATOR ', '), '-') AS Awards, 
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
				const sql = `SELECT b.ISBN AS ISBN, b.Category AS Category, IFNULL(GROUP_CONCAT(DISTINCT aw.Name ORDER BY aw.Name SEPARATOR ', '), '-') AS Awards,  b.Title AS Title, a.Name AS Author, b.Year, b.Price, Sum(COALESCE(i.Number, 0)) AS Quantity, COUNT(*) OVER() AS totalCount
				FROM Book b
				JOIN Author a ON b.Author_ID = a.ID
                LEFT JOIN Award_has_Book ab ON b.ISBN = ab.Book_ISBN
				LEFT JOIN Award aw ON ab.Award_ID = aw.ID
                LEFT JOIN Inventory i ON i.Book_ISBN = b.ISBN
				WHERE a.Name LIKE CONCAT('%', ?, '%') GROUP BY b.ISBN, b.Category, b.Title, a.Name, b.Year, b.Price LIMIT ? OFFSET ?`;

				[result] = await promisePool.query(sql, [query, limit, offset]);
			} else if (option === "award") {
				const sql = `SELECT b.ISBN AS ISBN, b.Category AS Category, IFNULL(GROUP_CONCAT(DISTINCT aw.Name ORDER BY aw.Name SEPARATOR ', '), '-') AS Awards,  b.Title AS Title, a.Name AS Author, b.Year, b.Price, Sum(COALESCE(i.Number, 0)) AS Quantity, COUNT(*) OVER() AS totalCount
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
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;`
			);

			const sql = `select r.ID, r.Book_ISBN AS ISBN, b.Title AS Title, r.Number as Number, DATE_FORMAT(r.Reservation_date, '%Y-%m-%d %H:%i:%s') AS Reservation_date, DATE_FORMAT(r.Pickup_time, '%Y-%m-%d %H:%i:%s') AS Pickup_time, Count(*) OVER() AS totalCount
            from Reservation r
            JOIN Book b ON r.Book_ISBN = b.ISBN
            where r.Customer_Email= ? and r.Customer_Email != 'admin' LIMIT ? OFFSET ?`;

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
	getShoppingBasket: async (email, limit, offset) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;`
			);

			const sql = `select s.BasketID AS BasketID, DATE_FORMAT(s.Order_date, '%Y-%m-%d %H:%i:%s') AS Order_date, b.ISBN AS ISBN, b.Title AS Title, c.Number as Number, b.Price as Price, Count(*) OVER() AS totalCount
            from Shopping_basket s
            JOIN Contains c ON c.Shopping_basket_BasketID = s.BasketID
            JOIN Book b ON b.ISBN = c.Book_ISBN
            where s.Customer_Email != 'admin' and s.Customer_Email= ? and s.Order_date is null LIMIT ? OFFSET ?`;

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
	getPurchaseHistory: async (email, limit, offset) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;`
			);

			const sql = `select s.BasketID AS BasketID, DATE_FORMAT(s.Order_date, '%Y-%m-%d %H:%i:%s') AS Order_date, Count(*) OVER() AS totalCount
            from Shopping_basket s
            where s.Customer_Email != 'admin' and s.Customer_Email= ? and s.Order_date is not null LIMIT ? OFFSET ?`;

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
	getOrderDetails: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;`
			);

			const sql = `select c.Book_ISBN AS Book_ISBN, b.Title AS Title, c.Number AS Number, b.Price AS Price 
			from Shopping_basket s
			JOIN Contains c ON s.BasketID = c.Shopping_basket_BasketID
			JOIN Book b ON b.ISBN = c.Book_ISBN
			WHERE s.BasketID = ?`;

			const [result] = await promisePool.query(sql, [data.BasketID]);

			return { success: true, books: result };
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
			//isolation 레벨 변경
			/*
				10분 전후로 예약 시간이 없어야하는데 read 후 update 전에 다른 예약이 들어오게되면,
				이를 막을 방법이 없어 serializable로 설정하였음.
			*/
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL READ SERIALIZABLE;`
			);

			//trasaction 시작
			await promisePool.query(`start transaction;`);

			const pickUpDateTime = new Date(data.pickupTime.replace(" ", "T"));
			const today = new Date();
			if (pickUpDateTime < today) {
				throw new Error("지금보다 과거로는 픽업이 불가합니다!");
			}
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
	updateOrderDate: async (data) => {
		try {
			//isolation 레벨 변경
			// * read uncommitted는 롤백된 데이터도 읽을 수 있어 위험함.
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			const sql = `select Order_date from Shopping_basket where BasketID = ?`;
			const [result] = await promisePool.query(sql, [data.BasketID]);

			if (result[0].Order_date !== null) {
				throw new Error("이미 구매한 상품입니다..");
			}

			const orderDate = new Date();
			const sql2 = `update Shopping_basket set Order_date = ? where BasketID = ?`;
			const [result2] = await promisePool.query(sql2, [
				format(orderDate, "yyyy-MM-dd HH:mm:ss"),
				data.BasketID,
			]);

			await promisePool.query(`commit;`);
			return { success: true };
		} catch (error) {
			await promisePool.query(`rollback;`);
			return { success: false, error: error.message };
		}
	},
};
export const deleteSql = {
	/*
        삭제 시 삭제된 수량은 warehouse 아무 곳이나 들어가게됨.
        이때 기존에 warehouse 중 1곳을 랜덤하게 선택하여, 추가하되, 
        추가하려는 warehouse에 이미 해당 책이 존재하는 경우 책 수량을 더한다.
    */
	deleteReservation: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);

			//1. warehouse 전체 개수 가져오고 이 중 하나 선택
			let candiWare = [];
			let pickWare;
			const countWareSql = `select Code from Warehouse;`;
			const [resultCountWare] = await promisePool.query(countWareSql);
			resultCountWare.forEach((item) => {
				candiWare.push(item.Code);
			});
			if (candiWare.length === 0) {
				throw new Error("Warehouse가 존재하지 않습니다!");
			}
			pickWare = candiWare[Math.floor(Math.random() * candiWare.length)];

			//2.고른 warehouse에 해당 책이 존재하는지 확인 후 없으면 추가, 있으면 기존 튜플에 값 더하기
			const checkBookSql = `select * from Inventory where Warehouse_Code = ? and Book_ISBN = ?;`;
			const [resultCheckBook] = await promisePool.query(checkBookSql, [
				pickWare,
				data.ISBN,
			]);
			if (resultCheckBook.length !== 0) {
				//고른 warehouse에 이미 책이 존재
				const addedNumber =
					resultCheckBook[0].Number + Number(data.Number);
				const addBookSql = `update Inventory set Number = ? where Warehouse_Code = ? and Book_ISBN = ?;`;
				const [resultAddBook] = await promisePool.query(addBookSql, [
					addedNumber,
					pickWare,
					data.ISBN,
				]);
			} else {
				//고른 warehouse에 책이 없는 경우
				console.log("hi!");
				const addBookSql = `insert into Inventory (Warehouse_Code, Book_ISBN, Number) values (?, ?, ?);`;
				const [resultAddBook] = await promisePool.query(addBookSql, [
					pickWare,
					data.ISBN,
					data.Number,
				]);
			}

			//3. 삭제
			const sql = `delete from Reservation where ID=?`;
			const [result] = await promisePool.query(sql, [data.id]);

			await promisePool.query(`commit;`);
			return { success: true };
		} catch (error) {
			await promisePool.query(`rollback;`);
			return { success: false, error: error.message };
		}
	},
	/*
        삭제 시 삭제된 수량은 warehouse 아무 곳이나 들어가게됨.
        이때 기존에 warehouse 중 1곳을 랜덤하게 선택하여, 추가하되, 
        추가하려는 warehouse에 이미 해당 책이 존재하는 경우 책 수량을 더한다.
    */
	deleteShoppingBasket: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			//trasaction 시작
			await promisePool.query(`start transaction;`);

			//1. warehouse 전체 개수 가져오고 이 중 하나 선택
			let candiWare = [];
			let pickWare;
			const countWareSql = `select Code from Warehouse;`;
			const [resultCountWare] = await promisePool.query(countWareSql);
			resultCountWare.forEach((item) => {
				candiWare.push(item.Code);
			});
			if (candiWare.length === 0) {
				throw new Error("Warehouse가 존재하지 않습니다!");
			}
			pickWare = candiWare[Math.floor(Math.random() * candiWare.length)];

			//2.고른 warehouse에 해당 책이 존재하는지 확인 후 없으면 추가, 있으면 기존 튜플에 값 더하기
			const checkBookSql = `select * from Inventory where Warehouse_Code = ? and Book_ISBN = ?;`;
			const [resultCheckBook] = await promisePool.query(checkBookSql, [
				pickWare,
				data.ISBN,
			]);
			if (resultCheckBook.length !== 0) {
				//고른 warehouse에 이미 책이 존재
				const addedNumber =
					resultCheckBook[0].Number + Number(data.Number);
				const addBookSql = `update Inventory set Number = ? where Warehouse_Code = ? and Book_ISBN = ?;`;
				const [resultAddBook] = await promisePool.query(addBookSql, [
					addedNumber,
					pickWare,
					data.ISBN,
				]);
			} else {
				//고른 warehouse에 책이 없는 경우
				console.log("hi!");
				const addBookSql = `insert into Inventory (Warehouse_Code, Book_ISBN, Number) values (?, ?, ?);`;
				const [resultAddBook] = await promisePool.query(addBookSql, [
					pickWare,
					data.ISBN,
					data.Number,
				]);
			}

			//3. 삭제하기 전 마지막 아이템인지 체크 후 마지막 아이템이라면 contains 지우고, shopping_basket도 지우기
			const sql = `select * from Contains where Shopping_basket_BasketID = ?`;
			const [result] = await promisePool.query(sql, [data.BasketID]);
			const sql2 = `delete from Contains where Book_ISBN=? and Shopping_basket_BasketID=?`;
			const [result2] = await promisePool.query(sql2, [
				data.ISBN,
				data.BasketID,
			]);
			console.log("길이:", result.length);
			if (result.length === 1) {
				//마지막 남은 장바구니의 아이템을 지우려고 하는 경우
				const sql3 = `delete from Shopping_basket where BasketID=? and Order_date IS NULL`;
				const [result3] = await promisePool.query(sql3, [
					data.BasketID,
				]);
			}

			await promisePool.query(`commit;`);
			return { success: true };
		} catch (error) {
			await promisePool.query(`rollback;`);
			return { success: false, error: error.message };
		}
	},
};

export const insertSql = {
	insertReservation: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
			);
			if (data.quantity <= 0) {
				throw new Error("1개 이상부터 예약이 가능합니다!");
			}
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check
			//새로운 ID 할당을 위해 read
			const check_sql = `select Max(ID) AS MaxID from Reservation`;
			const [checkResult] = await promisePool.query(check_sql);
			let newID;
			if (checkResult.length === 0) {
				newID = 0;
			} else {
				newID = checkResult[0].MaxID + 1;
			}

			//존재하는 책인지 체크
			const check_sql2 = `select count(*) as totalCount from Book where ISBN=?`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.ISBN,
			]);
			//존재하는 customer인지 체크
			const check_sql3 = `select count(*) as totalCount from Customer where Email=?`;
			const [checkResult3] = await promisePool.query(check_sql3, [
				data.Email,
			]);
			//책의 수량이 충분한지 체크
			const check_sql4 = `select Warehouse_Code, Number from Inventory where Book_ISBN=?`;
			const [checkResult4] = await promisePool.query(check_sql4, [
				data.ISBN,
			]);
			//10분 전후로 예약자가 존재하는지 확인
			const pickUpDateTime = new Date(data.pickupTime.replace(" ", "T"));
			const tenMinuteBefore = new Date(
				pickUpDateTime.getTime() - 10 * 1000 * 60
			);
			const tenMinuteAfter = new Date(
				pickUpDateTime.getTime() + 10 * 1000 * 60
			);

			const checkTenMinSql = `select count(*) AS totalCount from Reservation where ID != ? and Pickup_time Between ? and ?`;
			const [checkResult5] = await promisePool.query(checkTenMinSql, [
				newID,
				format(tenMinuteBefore, "yyyy-MM-dd HH:mm:ss"),
				format(tenMinuteAfter, "yyyy-MM-dd HH:mm:ss"),
				,
			]);

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
			console.log("test:", totalBookCount, data.quantity);
			if (totalBookCount < data.quantity) {
				throw new Error(
					"추가하고자 하는 책의 수량만큼 창고에 책이 존재하지 않습니다!"
				);
			}
			if (checkResult5[0].totalCount > 0) {
				throw new Error(
					"10분 전후로 픽업 예약자가 존재해 해당 시간으로 예약이 불가합니다!"
				);
			}
			//모든 warehouse를 순회하며 책을 개수만큼 제거함.
			let curBookCount = data.quantity;
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
						data.ISBN,
					]);
					break;
				} else {
					minusSql = `update inventory set Number = ? where Warehouse_Code=? and Book_ISBN=?`;
					[minusResult] = await promisePool.query(minusSql, [
						0,
						warehouse.Warehouse_Code,
						data.ISBN,
					]);
					curBookCount -= warehouse.Number;
				}
			}
			//execute
			const Reservation_date = new Date();
			const sql = `INSERT INTO Reservation (Book_ISBN, Customer_Email, ID, Reservation_date, Pickup_time, Number) VALUES (?,?,?,?,?,?)`;
			const [result] = await promisePool.query(sql, [
				data.ISBN,
				data.Email,
				newID,
				format(Reservation_date, "yyyy-MM-dd HH:mm:ss"),
				data.pickupTime,
				data.quantity,
			]);
			await promisePool.query(`commit;`);
			return { success: true };
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error.message);
			return { success: false, error: error.message };
		}
	},
	insertShoppingBasket: async (data) => {
		try {
			//isolation 레벨 변경
			await promisePool.query(
				`SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;` //장바구니에서는 절대 id 중복이 일어나면 안되기 때문에!
			);
			if (data.quantity <= 0) {
				throw new Error("1개 이상부터 추가가 가능합니다!");
			}
			//trasaction 시작
			await promisePool.query(`start transaction;`);
			//check

			//기존에 장바구니가 있는지 체크
			const checkShoppingBasket_sql = `select * from Shopping_basket where Customer_Email = ? and Order_date is null`;
			const [checkShoppingBasketResult] = await promisePool.query(
				checkShoppingBasket_sql,
				[data.Email]
			);
			let newID;
			let checkSameContainsResult = [];
			if (checkShoppingBasketResult.length === 0) {
				//기존에 장바구니가 없음
				//새로운 ID 할당을 위해 read
				const check_sql = `select Max(BasketID) AS MaxBasketID from Shopping_basket`;
				const [checkResult] = await promisePool.query(check_sql);

				if (checkResult.length === 0) {
					newID = 0;
				} else {
					newID = checkResult[0].MaxBasketID + 1;
				}
			} else {
				newID = checkShoppingBasketResult[0].BasketID;
				//Contains에 동일한 (Book_ISBN, Shopping_basket_BasketID) 키를 가지는 아이템이 있는지 검사
				const checkSameContains_sql = `select * from Contains where Book_ISBN = ? and Shopping_basket_BasketID = ?`;
				[checkSameContainsResult] = await promisePool.query(
					checkSameContains_sql,
					[data.ISBN, newID]
				);
			}

			//check2
			const check_sql2 = `select count(*) as totalCount from Customer where Email=? for update`;
			const [checkResult2] = await promisePool.query(check_sql2, [
				data.Email,
			]);
			//책이 존재하는지 확인
			const check_sq3 = `select count(*) as totalCount from Book where ISBN = ? for update`;
			const [checkResult3] = await promisePool.query(check_sq3, [
				data.ISBN,
			]);
			//책의 수량이 충분한지 체크
			const check_sql4 = `select Warehouse_Code, Number from Inventory where Book_ISBN=? for update`;
			const [checkResult4] = await promisePool.query(check_sql4, [
				data.ISBN,
			]);

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
			if (totalBookCount < data.quantity) {
				throw new Error(
					"추가하고자 하는 책의 수량만큼 창고에 책이 존재하지 않습니다!"
				);
			}
			//모든 warehouse를 순회하며 책을 개수만큼 제거함.
			let curBookCount = data.quantity;
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
						data.ISBN,
					]);
					break;
				} else {
					minusSql = `update inventory set Number = ? where Warehouse_Code=? and Book_ISBN=?`;
					[minusResult] = await promisePool.query(minusSql, [
						0,
						warehouse.Warehouse_Code,
						data.ISBN,
					]);
					curBookCount -= warehouse.Number;
				}
			}

			if (checkShoppingBasketResult.length === 0) {
				//execute
				const sql = `INSERT INTO Shopping_basket (BasketID, Order_date, Customer_Email) VALUES (?,?,?)`;
				const [result] = await promisePool.query(sql, [
					newID,
					null,
					data.Email,
				]);
				const sql2 = `INSERT INTO Contains (Book_ISBN, Shopping_basket_BasketID, Number) VALUES (?,?,?)`;
				const [result2] = await promisePool.query(sql2, [
					data.ISBN,
					newID,
					data.quantity,
				]);
			} else if (checkSameContainsResult.length > 0) {
				//Contains 에 동일한 (Book_ISBN, Shopping_basket_BasketID) 키가 이미 들어있는 경우
				//execute

				const sql2 = `UPDATE Contains SET Number = ? where Book_ISBN = ? and Shopping_basket_BasketID = ?`;
				const [result2] = await promisePool.query(sql2, [
					Number(checkSameContainsResult[0].Number) +
						Number(data.quantity),
					data.ISBN,
					newID,
				]);
			} else {
				//Contains 에 없는 새로운 책을 추가한 경우
				//execute
				const sql2 = `INSERT INTO Contains (Book_ISBN, Shopping_basket_BasketID, Number) VALUES (?,?,?)`;
				const [result2] = await promisePool.query(sql2, [
					data.ISBN,
					newID,
					data.quantity,
				]);
			}

			await promisePool.query(`commit;`);
			return { success: true };
		} catch (error) {
			await promisePool.query(`rollback;`);
			console.log(error.message);
			return { success: false, error: error.message };
		}
	},
};
