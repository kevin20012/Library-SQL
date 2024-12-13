import random
from datetime import datetime, timedelta
import re
from faker import Faker

fake = Faker()

#===============file name===============
FILENAME = "./sql/insert.sql"
#======================================

#=============Configuration=============
NUM_CUSTOMER = 1000
NUM_BOOKS = 100000
PROB_AWARD_TO_BOOK = 0.2
MAX_BOOK_COUNT_FOR_EACH = 50 #각 책이 최대 몇개까지 존재할지를 결정
NUM_AUTHOR = 5000
PROB_AWARD_TO_AUTHOR = 0.2 #몇 퍼센트의 작가에게 수상을 할지 결정
NUM_AWARD = 5000
NUM_WAREHOUSE = 1000
NUM_RESERVATION = 20000
NUM_SHOPPINGBASKET = 200000
#======================================

Admin = {
    "name": "admin",
    "password": "admin1234!"
}

def remove_special_symbol(str):
    return re.sub(r"[^\uAC00-\uD7A30-9a-zA-Z\s]", "", str)

# 데이터 생성 함수
def generate_shopping_basket(num_records):
    return [
        f"({i + 1}, '{fake.date_time_this_year().strftime('%Y-%m-%d %H:%M:%S')}')"
        for i in range(num_records)
    ]

def generate_customer(num_customers):
    def generate_password(length=12):
        # 가능한 문자들
        characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
        
        # 비밀번호 생성
        password = ''.join(random.choice(characters) for _ in range(length))
        return password
    result = []
    used_email = []
    for _ in range(num_customers):
        while(1):
            email = fake.email()
            if email not in used_email:
                used_email.append(email)
                break
            else:
                pass
        temp = f"('{email}', '{fake.phone_number()}', '{fake.address().replace(',', '')}', '{fake.name()}', 'Customer', '{generate_password(12)}')"
        result.append(temp)

    #Add admin
    result.append(f"('{Admin["name"]}', NULL, NULL, NULL, 'Administrator', '{Admin["password"]}')")
    return result

def generate_author(num_authors):
    result = []
    used_name = []
    for ids in range(num_authors):
        while(1):
            name = fake.name()
            if name not in used_name:
                used_name.append(name)
                break
            else:
                pass
        temp = f"('{name}', '{fake.url()}', '{fake.address().replace(',', '')}', {ids})"
        result.append(temp)

    return result

def generate_book(num_books, authors_id):
    result = []
    used_isbn = []
    category = [
        "Mystery",
        "Thriller",
        "Fantasy",
        "Historical Fiction",
        "Horror",
        "Literary fiction",
        "Science fiction",
        "Adventure fiction",
        "Contemporary literature",
        "Dystopian Fiction",
        "Romance novel",
        "Autobiography",
        "Graphic novel",
        "Biography",
        "Young adult",
        "Short story",
        "Classics",
        "Cookbook",
        "History",
        "Magical Realism",
        "Non-fiction",
        "Kids"
    ]

    for _ in range(num_books):
        while(1): # 중복된 isbn을 뽑으면 계속 다시 뽑음.
            isbn = fake.random_number(digits=8, fix_len=True) 
            if isbn not in used_isbn:
                used_isbn.append(isbn)
                break
            else:
                pass
        book_name = fake.sentence(nb_words=4)
        book_name = remove_special_symbol(book_name)
        # print(book_name)
        temp = f"({isbn}, '{random.choice(category)}', {round(random.uniform(5.0, 100.0), 2)}, '{book_name}', {fake.year()}, {int(random.choice(authors_id))})"
        result.append(temp)
    return result

def generate_award(num_awards):
    return [
        f"('{remove_special_symbol(fake.sentence(nb_words=1).split(".")[0]+" Award")}', {fake.year()}, {_ + 1})"
        for _ in range(num_awards)
    ]

def generate_award_has_book(num_books, awards_id, books_isbn):
    num_book_has_awards = int(num_books*PROB_AWARD_TO_BOOK) #전체의 20%만 상을 받음.
    result = []
    already_awarded = []

    for _ in range(num_book_has_awards):
        while(1):
            cur_book_isbn = random.choice(books_isbn)
            cur_award_id = random.choice(awards_id)
            if (cur_award_id, cur_book_isbn) not in already_awarded:
                already_awarded.append((cur_award_id, cur_book_isbn))
                break
            else:
                pass
            
        temp = f"({cur_award_id}, {cur_book_isbn})"
        result.append(temp)
    return result

def generate_author_has_award(num_author, awards_id, author_id):
    num_author_has_awards = int(num_author*PROB_AWARD_TO_AUTHOR) #전체의 20%만 상을 받음.
    result = []
    already_awarded = []

    for _ in range(num_author_has_awards):
        while(1):
            cur_author_id = random.choice(author_id)
            cur_award_id = random.choice(awards_id)
            if (cur_award_id, cur_author_id) not in already_awarded:
                already_awarded.append((cur_award_id, cur_author_id))
                break
            else:
                pass

        temp = f"({cur_author_id}, {cur_award_id})"
        result.append(temp)
    return result

def generate_warehouse(num_warehouse):
    return [
        f"({_ + 1}, '{fake.phone_number()}', '{fake.address().replace(',', '')}')"
        for _ in range(num_warehouse)
    ]

def generate_inventory(books_isbn, warehouses_code):
    '''
    각각의 book은 전체 개수가 정해져있고, 이는 전체 warehouse에 분산되어 저장된다.
    따라서 전체 book의 개수 = warehouse에 저장된 book의 합계 가 되어야한다. 
    '''
    result = []
    num_warehouse = len(warehouses_code)
    max_num_book = MAX_BOOK_COUNT_FOR_EACH
    for book in books_isbn:
        num_book = random.randint(int(max_num_book*0.5), max_num_book)
        # print(book, num_book)
        contain_count_list = []
        count_contain = 0
        '''
        전체 합이 num_book이 되도록 각 warehouse에 분산한 값을 리스트로 만듦.
        c.g. num_book = 50, num_warehouse=3이면
        contain_count_list = [10, 23, 17] 이렇게 분산시켜 저장하는 리스트를 만든다.
        '''
        for idx in range(num_warehouse):
            num_contain = random.randint(0, num_book)
            count_contain += num_contain
            if count_contain < num_book:
                if idx == num_warehouse-1: #마지막 warehouse에 왔는데 아직 개수를 못 채운 경우, 나머지 값을 계산해 full로 채운다.
                    contain_count_list.append(num_contain+(num_book-count_contain))
                else:
                    contain_count_list.append(num_contain)
            else:
                contain_count_list.append(num_book-(count_contain-num_contain))
                for _ in range(num_warehouse-idx-1):
                    contain_count_list.append(0)
                break
        random.shuffle(contain_count_list) #contain_count_list를 무작위로 순서를 섞음

        '''
        도출된 contain_count_list를 각 warehouse에 할당
        '''
        for (warehouse, book_count) in zip(warehouses_code, contain_count_list):
            if book_count != 0:
                temp = f"({warehouse}, {book}, {book_count})"
                result.append(temp)

    return result

def generate_reservation(book_isbns, customer_emails):
    '''
    Reservation 데이터를 생성한다.
    10분전후로 예약이 없도록한다.
    '''
    
    result = []
    reserved_pickup_times = set()  # Pickup time 중복 방지용

    for reservation_id in range(1, NUM_RESERVATION + 1):
        book_isbn = random.choice(book_isbns)  # Book_ISBN 랜덤 선택
        customer_email = random.choice(customer_emails)  # Customer_Email 랜덤 선택
        number = random.randint(1, 5)  # Number 값 랜덤 (1~5 사이 값)
        
        # Reservation_date와 Pickup_time 생성
        reservation_date = fake.date_time_this_year(before_now=True, after_now=False).strftime('%Y-%m-%d %H:%M:%S')
        pickup_time = datetime.strptime(reservation_date, '%Y-%m-%d %H:%M:%S') + timedelta(minutes=random.randint(10, 120))

        # Pickup_time이 중복되지 않도록 10분 단위로 조정
        while any(abs((pickup_time - existing_time).total_seconds()) < 600 for existing_time in reserved_pickup_times):
            pickup_time += timedelta(minutes=10)

        reserved_pickup_times.add(pickup_time)
        
        temp = f"({book_isbn}, '{customer_email}', {reservation_id}, '{reservation_date}', '{pickup_time.strftime('%Y-%m-%d %H:%M:%S')}', {number})"
        result.append(temp)
    
    return result

def generate_shopping_basket_and_contains(book_isbns, customer_emails):
    '''
    shopping_basket과 그에 해당하는 contains 데이터를 생성한다.
    
    '''

    shopping_basket_data = []
    contains_data = []

    for basket_id in range(1, NUM_SHOPPINGBASKET+1):
        # shopping_basket 데이터 생성
        customer_email = random.choice(customer_emails)  # 랜덤 고객 이메일 선택
        order_date = fake.date_time_this_year().strftime('%Y-%m-%d %H:%M:%S')  # 주문 날짜 생성
        shopping_basket_data.append(f"({basket_id}, '{order_date}', '{customer_email}')")

        # contains 데이터 생성
        num_books_in_basket = random.randint(1, 5)  # 장바구니에 담길 책 개수 (1~5개 랜덤)
        selected_books = random.sample(book_isbns, num_books_in_basket)  # 책 ISBN 선택
        for book_isbn in selected_books:
            book_count = random.randint(1, 5)  # 각 책의 수량 (1~5 랜덤)
            contains_data.append(f"({book_isbn}, {basket_id}, {book_count})")

    return shopping_basket_data, contains_data

# SQL 파일 저장 함수
def save_to_sql(filename, table_name, data, columns):
    with open(filename, mode='a', encoding='utf-8') as file:
        file.write(f"INSERT INTO `{table_name}` ({', '.join(columns)}) VALUES\n")
        file.write(",\n".join(data))
        file.write(";\n\n")


# SQL 파일 초기화
open(FILENAME, 'w').close()


# 1. Customer
print("Make Customer...")
customer_data = generate_customer(NUM_CUSTOMER)
save_to_sql(FILENAME, "Customer", customer_data, ["Email", "Phone", "Address", "Name", "Role", "Password"])

# 2. Author
print("Make Author...")
author_data = generate_author(NUM_AUTHOR)
author_id = [row.split(',')[3].strip(")'") for row in author_data]
save_to_sql(FILENAME, "Author", author_data, ["Name", "URL", "Address", "ID"])

# 3. Book
print("Make Book...")
book_data = generate_book(NUM_BOOKS, author_id)
book_isbns = [row.split(',')[0].strip("(") for row in book_data]
save_to_sql(FILENAME, "Book", book_data, ["ISBN", "Category", "Price", "Title", "Year", "Author_ID"])

# 4. Award
print("Make Award...")
award_data = generate_award(NUM_AWARD)
award_ids = [row.split(',')[-1].strip(")") for row in award_data]
save_to_sql(FILENAME, "Award", award_data, ["Name", "Year", "ID"])

# 5. Author_has_Award
print("Make Author_has_Award...")
Author_has_Award_data = generate_author_has_award(NUM_AUTHOR, award_ids, author_id)
save_to_sql(FILENAME, "Author_has_Award", Author_has_Award_data, ["Author_ID", "Award_ID"])

# 6. Award_has_Book
print("Make Award_has_Book...")
award_has_book_data = generate_award_has_book(NUM_BOOKS, award_ids, book_isbns)
save_to_sql(FILENAME, "Award_has_Book", award_has_book_data, ["Award_ID", "Book_ISBN"])

# 7. Warehouse
print("Make Warehouse...")
warehouse_data = generate_warehouse(NUM_WAREHOUSE)
warehouse_codes = [row.split(',')[0].strip("(") for row in warehouse_data]
save_to_sql(FILENAME, "Warehouse", warehouse_data, ["Code", "Phone", "Address"])

# 8. Inventory
print("Make Inventory...")
inventory_data = generate_inventory(book_isbns, warehouse_codes)
save_to_sql(FILENAME, "Inventory", inventory_data, ["Warehouse_Code", "Book_ISBN", "Number"])

# 9. Reservation
print("Make Reservation...")
customer_emails = [row.split(',')[0].strip("('") for row in customer_data if row.split(',')[4].strip(" '") == 'Customer']
reservation_data = generate_reservation(book_isbns, customer_emails)
save_to_sql(FILENAME, "Reservation", reservation_data, ["Book_ISBN", "Customer_Email", "ID", "Reservation_date", "Pickup_time", "Number"])

# 10. ShoppingBasket & Contains
print("Make ShoppingBasket...")
shopping_basket_data, contains_data = generate_shopping_basket_and_contains(book_isbns, customer_emails)
save_to_sql(FILENAME, "Shopping_basket", shopping_basket_data, ["BasketID", "Order_date", "Customer_Email"])
save_to_sql(FILENAME, "Contains", contains_data, ["Book_ISBN", "Shopping_basket_BasketID", "Number"])