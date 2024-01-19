
* 설치 및 파일 수정

npm init -y
npm i express
npm i mongodb
npm i express-handlebars
npm i nodemon
npm i lodash


---------------
(테스팅 추가) Jest 라이브러리

npm install --save-dev jest
"scripts": {
    "test": "jest"
}

프로젝트 내에 __tests__ 폴더를 생성
파일 이름에 .test.js 또는 .spec.js를 붙임

테스트 실행: npm test

*** jest > 몽고디비 test
: mock 몽고디비 + 실제 mongoClient 를 불러와야 함


----------------

프로젝트 구조

* 게시글 : 데이터 스키마 설정없이 object 로 저장가능

* 게시글 <---> 댓글
연관관계 필요없이 게시글의 id 를 가져와 댓글 쓸때 저장하면
게시글의 댓글로 포함됨


(예시)
detail.handlebars
<input type="hidden" name="id" value="{{_id}}"> // 본문 id 를 저장하게 됨

[몽고디비 데이터 확인]
_id:65a8c689990937093630c228
title : "1"
writer:"1"
password:"1"
content:"1"
hits:3
createdDt:"2024-01-18T06:34:49.974Z"
comments:Array (1)


----------------

* handlebars-helpers.js의 역할
app.engine("handlebars", handlebars.create({ ... }).engine);
코드 부분에서는 이러한 사용자 정의 헬퍼들을 Handlebars 엔진에 등록하고 있습니다.
이렇게 함으로써 템플릿 내에서 {{lengthOfList myList}}, {{eq myValue 'expectedValue'}}, {{dateString myDate}}와 같은 형식으로
헬퍼 함수들을 호출할 수 있게 됩니다.

이러한 헬퍼 함수들은 템플릿의 재사용성과 유지보수성을 높여주며, 복잡한 로직을 템플릿 외부에서 처리할 수 있게
해줌으로써 템플릿을 더 깔끔하고 이해하기 쉽게 만들어 줍니다.

* repository -> 몽고디비는 collection 으로 .

collection
:MongoDB의 컬렉션 객체
이 컬렉션에서 데이터를 조회, 생성 등

let collection; 초기화


--------------------

* const query = { title: new RegExp(search, i) }

new RegExp(search, 'i')
: search 변수에 담긴 문자열을 기반으로 하는 새로운 정규 표현식 객체를 만듭니다.
두 번째 인자인 'i'는 대소문자를 구분하지 않는 "case-insensitive" 매칭을 수행하라는 플래그입니다.

코드에서 query 객체는 MongoDB 쿼리를 위해 사용됩니다.
이 경우, query는 title 필드가 search 문자열을 포함하는 모든 문서를 찾는데 사용될 수 있습니다.
RegExp 객체를 사용함으로써, search 문자열이 정확히 일치하지 않아도 포함만 되어 있으면 매칭이 이루어집니다.

예를 들어:
search가 "test"라면, 정규 표현식은 /test/i가 됩니다.
title 필드가 "Test", "TEST", "teSt" 등의 값을 가진 문서는 모두 이 쿼리에 의해 선택됩니다.
이러한 방식은 사용자가 검색어를 입력할 때 대소문자를 정확히 맞추지 않아도 관련된 결과를 찾을 수 있게 해줍니다.

------------------------

post-service.js

* async function getDetailPost(collection, id) {
      return await collection.findOneAndUpdate({ _id: ObjectId(id) }, { $inc: { hits: 1 }}, projectionOption)

  }
  =>TypeError: Class constructor ObjectId cannot be invoked without 'new'

: new 키워드 붙였더니 에러 해결됨

async function getDetailPost(collection, id) {
    return await collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $inc: { hits: 1 }}, projectionOption)

}

---------------------
* 책 코드 수정

app.get("/detail/:id", async (req, res) => {
    const result = await postService.getDetailPost(collection, req.params.id)
    // console.log("[result]", result)
    // console.log("[result.value]", result.value)
    res.render("detail", {title: "테스트 게시판", post: result.value,})
})

* post: result.value로 내보내면 detail 화면에 아무값도 나오지 않음. 그래서 console.log로 찍어보았다.
result.value가 undefined 로 나온것을 확인 후 value 를 삭제하니 해결되었다.

=> console.log("[result]", result) 결과
:[result] {
   _id: new ObjectId('65a775f51b95b121712dd1b7'),
   title: '7장을 수정중',
   writer: '승귤',
   content: '7장의 글 수정 API 부분을 수정하고 있습니다.',
   hits: 9,
   createdDt: '2024-01-17T06:38:45.140Z'
 }

=> console.log("[result.value]", result.value) 결과
:[result.value] undefined

-----------------------

* 등록일

최초 게시물 등록일
-> 그런데 게시물 수정하면 최초 등록일자로 변경되어 목록 맨 위로 올라오는 현상
=> 모든 modify 메서드에도  new Date()으로 설정했기 때문.
그래서 modify 메서드 > post 객체에 날짜 부분 삭제

------------------------

