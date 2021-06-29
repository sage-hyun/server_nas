# Knotknot - Server

가족이 함께쓰는 감정일기 어플리케이션인 Knotknot의 서버 프로그램입니다.

## API Reference
* routes/user.js
    * [로그인](#로그인)  
    * [회원가입](#회원가입)  
    * [가족 코드 조회하기](#가족-코드-조회하기)  
* routes/diary.js
    * [가족이 작성한 일기들의 목록 가져오기](#가족이-작성한-일기들의-목록-가져오기)  
    * [일기 작성하기](#일기-작성하기)  
    * [일기 수정하기](#일기-수정하기)  
    * [일기 삭제하기](#일기-삭제하기)  
* routes/comments.js
    * [특정 일기에 대한 코멘트 목록 가져오기](#특정-일기에-대한-코멘트-목록-가져오기)  
    * [코멘트 작성하기](#코멘트-작성하기)  
    * [코멘트 수정하기](#코멘트-수정하기)  
    * [코멘트 삭제하기](#코멘트-삭제하기)  
* routes/calendar.js
    * [캘린더 데이터 가져오기](#캘린더-데이터-가져오기)  

---
### 로그인

```http
  POST /users/login
```

* Authorization: None  
* Request Body:

| Field Name | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required.** 사용자 이메일 |
| `password` | `string` | **Required.** 사용자 암호 |
  
* Response (Success):
```
  Status: 200 OK
```

| Field Name | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `result` | `string` | 결과 메세지 |
| `token` | `string` | JWT 토큰 |
| `nickname` | `string` | 사용자 닉네임 |
| `family_code` | `string` | 사용자가 속한 가족 코드 |

* Response (Failure):
```
  Status: 401 Unauthorized   // 존재하지 않는 사용자
```
---
### 회원가입

```http
  POST /users/join
```
* Authorization: None  
* Request Body:

| Field Name | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required.** 사용자 이메일 |
| `password` | `string` | **Required.** 사용자 암호 |
| `nickname` | `string` | **Required.** 사용자 닉네임 |
| `birth` | `string` | Optional. 생년월일 |
| `family_code` | `string` | Optional. 가족코드 (null이면 새로운 가족코드 생성) |
  
* Response (Success):
```
  Status: 200 OK
```

| Field Name | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `result` | `string` | 결과 메세지 |

* Response (Failure):
```
  Status: 400 Bad Request   // 이미 가입된 이메일 주소입니다
```
```
  Status: 400 Bad Request   // 가족 코드가 잘못되었습니다
```

---
### 가족 코드 조회하기

```http
  GET /users/familycode
```

* Authorization: Bearer Token  
* Response (Success):
```
  Status: 200 OK
```
| Field Name | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `family_code` | `string` | 사용자가 속한 가족 코드 |

---
### 가족이 작성한 일기들의 목록 가져오기

```http
  GET /diary
```
* Query String Parameters:

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `date` | `string` | Optional. 해당 날짜의 일기 목록을 가져옴 (YYYY-MM-dd) |

* Authorization: Bearer Token  

* Response (Success):
```
  Status: 200 OK
```

| Field Name | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `diaries` | `object[]` | 일기 리스트 |
| `ㄴdiary_id` | `int` | 일기 고유번호 |
| `ㄴdescription` | `string` | 일기 내용 |
| `ㄴemotion` | `int` | 감정티콘 번호 |
| `ㄴcreatedAt` | `string` | 작성 시간 |
| `ㄴwriter` | `string` | 작성자 email |
| `ㄴcommentsCount` | `int` | 일기의 코멘트 수 |
| `ㄴuser.nickname` | `string` | 작성자 닉네임 |

---
### 일기 작성하기

```http
  POST /diary
```

* Authorization: Bearer Token  
* Request Body:

| Field Name | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `description` | `string` | **Required.** 일기 내용 |
| `emotion` | `int` | **Required.** 감정티콘 번호 |
| `createdAt` | `string` | Optional. 작성 시간 |
  
* Response (Success):
```
  Status: 200 OK
```

---
### 일기 수정하기

```http
  PUT /diary/:diaryId
```
* Path Parameters:

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `diaryId` | `int` | **Required.** 수정하려는 일기의 고유번호 |

* Authorization: Bearer Token  
* Request Body:

| Field Name | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `description` | `string` | Optional. 일기 내용 |
| `emotion` | `int` | Optional. 감정티콘 번호 |
  
* Response (Success):
```
  Status: 200 OK
```
* Response (Failure):
```
  Status: 401 Unauthorized   // user (JWT info) != writer
```
```
  Status: 404 Not Found     // diary with diaryId doesn't exist
```

---
### 일기 삭제하기

```http
  DELETE /diary/:diaryId
```
* Path Parameters:

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `diaryId` | `int` | **Required.** 삭제하려는 일기의 고유번호 |

* Authorization: Bearer Token  

* Response (Success):
```
  Status: 200 OK
```
* Response (Failure):
```
  Status: 401 Unauthorized   // user (JWT info) != writer
```
```
  Status: 404 Not Found     // diary with diaryId doesn't exist
```

---
### 특정 일기에 대한 코멘트 목록 가져오기

```http
  GET /comments/:diaryId
```
* Path Parameters:

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `diaryId` | `int` | **Required.** 코멘트를 조회하려는 일기의 고유번호 |


* Authorization: Bearer Token  
* Response (Success):
```
  Status: 200 OK
```

| Field Name | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `comments` | `object[]` | 코멘트 리스트 |
| `ㄴcomments_id` | `int` | 코멘트 고유번호 |
| `ㄴcontent` | `string` | 코멘트 내용 |
| `ㄴcreatedAt` | `string` | 작성 시간 |
| `ㄴwriter` | `string` | 작성자 email |
| `ㄴuser.nickname` | `string` | 작성자 닉네임 |

* Response (Failure):
```
  Status: 401 Unauthorized   // 사용자가 일기(diaryId) 작성자의 가족이 아닐 때
```

---
### 코멘트 작성하기

```http
  POST /comments/:diaryId
```
* Path Parameters:

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `diaryId` | `int` | **Required.** 코멘트를 작성할 일기의 고유번호 |

* Authorization: Bearer Token  
* Request Body:

| Field Name | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `content` | `string` | **Required.** 코멘트 내용 |
| `createdAt` | `string` | Optional. 작성 시간 |
  
* Response (Success):
```
  Status: 200 OK
```
* Response (Failure):
```
  Status: 401 Unauthorized   // 사용자가 일기(diaryId) 작성자의 가족이 아닐 때
```

---
### 코멘트 수정하기

```http
  PUT /comments/:commentsId
```
* Path Parameters:

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `commentsId` | `int` | **Required.** 수정하려는 코멘트의 고유번호 |

* Authorization: Bearer Token  
* Request Body:

| Field Name | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `content` | `string` | **Required.** 코멘트 내용 |
  
* Response (Success):
```
  Status: 200 OK
```
* Response (Failure):
```
  Status: 401 Unauthorized   // user (JWT info) != writer
```
```
  Status: 404 Not Found     // diary with diaryId doesn't exist
```

---
### 코멘트 삭제하기

```http
  DELETE /comments/:commentsId
```
* Path Parameters:

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `commentsId` | `int` | **Required.** 삭제하려는 코멘트의 고유번호 |

* Authorization: Bearer Token  

* Response (Success):
```
  Status: 200 OK
```
* Response (Failure):
```
  Status: 401 Unauthorized   // user (JWT info) != writer
```
```
  Status: 404 Not Found     // diary with diaryId doesn't exist
```


---
### 캘린더 데이터 가져오기

```http
  GET /calendar
```
* Query String Parameters:

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `yearMonth` | `string` | Optional. 해당 시기의 캘린더 정보를 가져옴 (YYYY-MM) |

* Authorization: Bearer Token  

* Response (Success):
```
  Status: 200 OK
```

| Field Name | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `calendar` | `object[]` | 캘린더 정보 리스트 |
| `ㄴdate` | `string` | 날짜 (YYYY-MM-dd) |
| `ㄴuser_count_total` | `int` | 당일 가족구성원의 수 |
| `ㄴuser_count_diary` | `int` | 당일 일기를 작성한 가족구성원의 수 |
| `ㄴuser_count_comments` | `int` | 당일 코멘트를 작성한 가족구성원의 수 |
