# 도서관 DB 구축 프로젝트

해당 프로젝트는 인하대학교 2024-2 데이터베이스 설계 교과목의 Final Term Project입니다.

# 프로젝트 실행 순서

1. **우선 .env 파일이 필요합니다.이는 DB 접속을 위한 값으로 공유하지 않았습니다. 형식은 아래와 같습니다.  
   최상단 경로에 위치시켜주면 됩니다.**

```python
DB_HOST=localhost
DB_USER=root
DB_PASSWORD= [your passward]
DB_NAME=Term
DB_PORT=3306
```

2. **DB 생성하기**  
   mysql 로그인 후 아래를 순차적으로 실행

-   `source create.sql`
-   `source insert.sql`
-   `source index.sql`

3. 프로젝트 최상단 경로에서 `npm run start` 실행

4. **관리자와 구매자**

-   관리자 id / pw

```
ID : admin
PW : admin1234!
```

-   구매자 id / pw (구매자는 customer 테이블 내의 아무나 해도 됩니다. 아래는 예시입니다.)

```
ID : acoleman@example.com
PW : f5cB28rK3rph
```
