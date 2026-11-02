import requests
from bs4 import BeautifulSoup
import os
from datetime import datetime

SLACK_WEBHOOK = os.environ["SLACK_WEBHOOK"]

KEYWORDS = [
    "외국인", "관광", "투어", "이벤트", "행사", "MICE", "문화", "커뮤니티",
    "글로벌", "인바운드", "체험", "소셜", "국제"
]

def is_relevant(title):
    return any(kw in title for kw in KEYWORDS)

def fetch_g2b():
    results = []
    try:
        url = "https://www.g2b.go.kr:8101/ep/tbid/tbBidList.do?bidNm=외국인+관광+이벤트&searchType=1"
        headers = {"User-Agent": "Mozilla/5.0"}
        res = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(res.text, "html.parser")
        rows = soup.select("table.list tbody tr")
        for row in rows[:20]:
            cols = row.select("td")
            if len(cols) < 4:
                continue
            title = cols[1].get_text(strip=True)
            if is_relevant(title):
                link_tag = cols[1].find("a")
                href = "https://www.g2b.go.kr" + link_tag["href"] if link_tag else "https://www.g2b.go.kr"
                deadline = cols[4].get_text(strip=True) if len(cols) > 4 else "-"
                results.append({"title": title, "link": href, "deadline": deadline, "source": "나라장터"})
    except Exception as e:
        print(f"G2B error: {e}")
    return results

def fetch_kstartup():
    results = []
    try:
        import json
        url = "https://www.k-startup.go.kr/common/selectBizPbanc.do"
        headers = {
            "User-Agent": "Mozilla/5.0",
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": "https://www.k-startup.go.kr/web/contents/bizpbanc-ongoing.do"
        }
        data = "schM=list&page=1&pageUnit=20&pbancSttus=ing"
        res = requests.post(url, headers=headers, data=data, timeout=15)
        items = res.json().get("bizPbancList", [])
        for item in items:
            title = item.get("pbancNm", "")
            if is_relevant(title):
                pbanc_id = item.get("pbancSn", "")
                href = f"https://www.k-startup.go.kr/web/contents/bizpbanc-ongoing.do?pbancSn={pbanc_id}"
                deadline = item.get("pbancEndDt", "-")
                results.append({"title": title, "link": href, "deadline": deadline, "source": "K-Startup"})
        print(f"K-Startup: {len(items)}개 공고 중 {len(results)}개 매칭")
    except Exception as e:
        print(f"K-Startup error: {e}")
    return results

def send_to_slack(items):
    today = datetime.now().strftime("%Y년 %m월 %d일")
    if not items:
        text = f"*📋 {today} 지원사업 알림*\n오늘은 기르에 맞는 공고가 없습니다."
    else:
        text = f"*📋 {today} 지원사업 알림* ({len(items)}건)\n"
        for item in items:
            text += f"\n• [{item['source']}] <{item['link']}|{item['title']}> — 마감: {item['deadline']}"
    
    res = requests.post(SLACK_WEBHOOK, json={"text": text})
    print(f"Slack: {res.status_code}")

if __name__ == "__main__":
    items = fetch_g2b() + fetch_kstartup()
    send_to_slack(items)
    print(f"총 {len(items)}건 전송")
