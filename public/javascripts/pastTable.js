

document.addEventListener("DOMContentLoaded", function(){
    getAllTable().then((items) =>{
        setTable(items)
    });

    const form = document.getElementById("searchCompany");

    form.addEventListener("submit", async function(event){
        event.preventDefault();
        const inputName = form.querySelector('input[type="search"]').value;
        const companyName = removeSpaces(inputName);
    
        if(!checkInputName(companyName)){
            NoInputAlert();
        }
        else if(!checkCompanyName(companyName)){
            NoCompanyAlert();
        }
        else{
            getCompanyTable(companyName).then((items) =>{
                const tableBody = document.getElementById('table-body');
                tableBody.innerHTML = ''; // tableBody 요소 안의 모든 HTML을 삭제합니다.

                setTable(items);
            });
        }
    
    });
});

async function getAllTable(){
    try {
        return await fetch("/pastTable/getAllTable", {
          method: "POST",
          body: JSON.stringify({}),
          headers: {
            "Content-Type": "application/json",
          },
        }).then(response => response.json())
        .then(json => json);
    
    }
    catch(error){
        alert('SQL 작업 도중 오류가 발생했습니다. - 1');
    }
}

function setTable(data){
    const tableBody = document.getElementById('table-body');

    for(let i = 0; i < data.length ; i++){
        const row = document.createElement('tr');

        const numberCell = document.createElement('th');
        numberCell.setAttribute('scope', 'row');
        numberCell.textContent = i + 1;

        const dateCell = document.createElement('td');
        dateCell.textContent = data[i].date;

        const predictCell = document.createElement('td');
        predictCell.textContent = data[i].company;

        const resultCell = document.createElement('td');
        resultCell.textContent = data[i].class;

        row.appendChild(numberCell);
        row.appendChild(dateCell);
        row.appendChild(predictCell);
        row.appendChild(resultCell);

      tableBody.appendChild(row);
    }
}

async function getCompanyTable(companyName){
    console.log(companyName);
    try {
        return await fetch("/pastTable/getCompanyTable", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            company: companyName,
         }),
        }).then(response => response.json())
        .then(json => json);
    }
    catch(error){
        console.log(error);
        alert('SQL 작업 도중 오류가 발생했습니다. - 1');
    }
}

function checkInputName(inputName){
    if(inputName.length == 0) return false;
    return true;
}

function checkCompanyName(inputName){
    const isNameInList = companyNames.includes(inputName);

    if(isNameInList) return  true;
    return false;
}

function removeSpaces(inputString) {
    return inputString.replace(/\s/g, '');
}

// showAlert
function NoInputAlert(){
    alert("회사 이름이 입력되지 않았습니다. 회사 이름을 입력해주세요.");
}

function NoCompanyAlert(){
    alert("입력할 수 없는 회사입니다. 검색 가능한 회사 이름을 확인하세요");
}

const companyNames = [
    'APS', 'DB', 'FSN', 'KG모빌리언스', 'KG이니시스', 'MDS테크', 'NAVER', 'NHN', 'NHNKCP',
    'NICE', 'SBI핀테크솔루션즈', 'SGA', 'SGA솔루션즈', 'THEE&M', '가비아', '갤럭시아머니트리',
    '고스트스튜디오', '굿센', '나라소프트', '나무기술', '네오리진', '네오위즈', '네오위즈홀딩스',
    '네이블', '넥슨게임즈', '넵튠', '넷마블', '누리플렉스', '다날', '대신정보통신', '대아티아이',
    '더블유게임즈', '더존비즈온', '데브시스터즈', '데이타솔루션', '데이터스트림즈', '드래곤플라이',
    '디모아', '디어유', '디지캡', '딥노이드', '라온시큐어', '라온피플', '라피치', '레뷰코퍼레이션',
    '로지시스', '롯데정보통신', '룽투코리아', '리노스', '링넷트', '링크제니시스', '마음AI', '맥스트',
    '메쎄이상', '모니터랩', '모비릭스', '모아데이타', '모코엠시스', '미디어젠', '미래아이앤지',
    '미스터블루', '미투온', '바이브컴퍼니', '밸로프', '버넥트', '베스파', '벨로크', '브레인즈컴퍼니',
    '브리지텍', '비즈니스온', '비츠로시스', '비투엔', '비트나인', '비플라이소프트', '산돌',
    '삼성에스디에스', '샌즈랩', '세중', '소프트센', '소프트센우', '소프트캠프', '솔트룩스', '솔트웨어',
    '수산아이앤티', '슈어소프트테크', '스카이문스테크놀로지', '스코넥', '시큐레터', '시큐브', '시큐센',
    '시티랩스', '신세계I&C', '싸이버원', '쌍용정보통신', '썸에이지', '씨유박스', '씨이랩', '아시아나IDT',
    '아이퀘스트', '아이티아이즈', '아톤', '아프리카TV', '안랩', '알서포트', '알체라', '알티캐스트',
    '액션스퀘어', '액토즈소프트', '에스넷', '에스에스알', '에스트래픽', '에프앤가이드', '엑셈', '엑스게이트',
    '엔씨소프트', '엔텔스', '엠게임', '엠로', '엠브레인', '엠아이큐브솔루션', '영림원소프트랩', '오브젠',
    '오비고', '오상자이엘', '오파스넷', '와이더플래닛', '원티드랩', '웨이버스', '웹젠', '웹케시',
    '위메이드', '위메이드맥스', '위메이드플레이', '위세아이텍', '윈스', '유니포인트', '유엔젤', '율호',
    '이글루', '이노뎁', '이노룰스', '이노시뮬레이션', '이니텍', '이루온', '이삭엔지니어링', '이스트소프트',
    '이씨에스', '이트론', '인스웨이브시스템즈', '인지소프트', '인포바인크', '인포뱅크', '자이언트스텝', '정원엔시스',
    '조이시티', '줌인터넷', '지니언스', '지란지교시큐리티', '지슨', '카카오', '카카오게임즈', '카카오페이',
    '카페24', '캐리소프트', '컴투스', '컴투스홀딩스', '케이사인', '케이씨에스', '케이아이엔엑스', '케이엘넷',
    '코나아이', '코난테크놀로지', '코닉오토메이션', '콤텍시스템', '쿠콘', '큐로컴', '크라우드웍스', '크래프톤',
    '키네마스터', '키다리스튜디오', '탑코미디어', '텔코웨어', '토마토시스템', '투비소프트', '티라유텍',
    '티사이언티픽', '티쓰리', '틸론', '파수', '판도라티비', '펄어비스', '포스코DX', '포시에스',
    '폴라리스오피스', '플래티어', '플랜티넷', '플레이위드', '플리토', '피노텍', '핀텔', '핑거', '핑거스토리',
    '한국전자금융', '한국전자인증', '한국정보인증', '한국정보통신', '한글과컴퓨터', '한네트', '한빛소프트',
    '한솔인티큐브', '한싹', '한컴위드', '핸디소프트', '헥토이노베이션', '헥토파이낸셜', '현대오토에버', '휴네시온'
];
