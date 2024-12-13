-- 외래 키 제약 조건 비활성화
SET FOREIGN_KEY_CHECKS = 0;

-- 각 테이블 데이터 삭제
TRUNCATE TABLE Author_has_Award;
TRUNCATE TABLE Inventory;
TRUNCATE TABLE Warehouse;
TRUNCATE TABLE Award_has_Book;
TRUNCATE TABLE Award;
TRUNCATE TABLE Contains;
TRUNCATE TABLE Shopping_basket;
TRUNCATE TABLE Reservation;
TRUNCATE TABLE Book;
TRUNCATE TABLE Author;
TRUNCATE TABLE Customer;

-- 외래 키 제약 조건 다시 활성화
SET FOREIGN_KEY_CHECKS = 1;