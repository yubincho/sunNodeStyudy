
npm init -y
npm i express
npm i mongodb
npm i express-handlebars
npm i nodemon
npm i lodash

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