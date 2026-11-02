export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-2">개인정보처리방침</h1>
      <p className="text-sm text-gray-500 mb-10">Privacy Policy</p>
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">1. 수집하는 개인정보 / Information We Collect</h2>
        <p className="text-sm leading-relaxed text-gray-700 mb-2">회사는 서비스 제공을 위해 다음의 개인정보를 수집합니다: 이름, 이메일 주소, 연락처, 국적, 성별, 생년월일(선택), 결제 정보.</p>
        <p className="text-sm leading-relaxed text-gray-500">We collect the following personal information to provide our services: name, email address, phone number, nationality, gender, date of birth (optional), and payment information.</p>
      </section>
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">2. 수집 목적 / Purpose of Collection</h2>
        <ul className="text-sm leading-relaxed text-gray-700 space-y-1 mb-2">
          <li>• 투어·이벤트 예약 및 참가자 확인</li>
          <li>• 결제 처리 및 환불 처리</li>
          <li>• 서비스 관련 공지 및 고객 응대</li>
          <li>• 서비스 개선을 위한 통계 분석</li>
        </ul>
        <ul className="text-sm leading-relaxed text-gray-500 space-y-1">
          <li>• Tour and event booking and participant verification</li>
          <li>• Payment processing and refund handling</li>
          <li>• Service notices and customer support</li>
          <li>• Statistical analysis for service improvement</li>
        </ul>
      </section>
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">3. 보관 기간 / Retention Period</h2>
        <p className="text-sm leading-relaxed text-gray-700 mb-2">개인정보는 회원 탈퇴 시 즉시 파기하는 것을 원칙으로 합니다. 단, 관련 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관 후 파기합니다. (예: 계약·청약 철회 기록 5년, 대금결제 기록 5년)</p>
        <p className="text-sm leading-relaxed text-gray-500">Personal information is deleted upon membership withdrawal. Information required by law will be retained for the legally required period. (e.g., contract/cancellation records: 5 years; payment records: 5 years)</p>
      </section>
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">4. 제3자 제공 / Third-Party Disclosure</h2>
        <p className="text-sm leading-relaxed text-gray-700 mb-2">회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만 결제 처리를 위해 결제대행사(Paddle)에 최소한의 정보가 전달되며, 법령에 따른 수사기관의 요청이 있는 경우에는 예외적으로 제공할 수 있습니다.</p>
        <p className="text-sm leading-relaxed text-gray-500">We do not provide personal information to third parties as a rule. Minimal information is shared with our payment processor (Paddle). Disclosure may occur when required by law enforcement.</p>
      </section>
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">5. 개인정보 보호 방법 / How We Protect Your Information</h2>
        <ul className="text-sm leading-relaxed text-gray-700 space-y-1 mb-2">
          <li>• SSL 암호화를 통한 데이터 전송 보호</li>
          <li>• Supabase 기반 접근 권한 관리 및 데이터베이스 보안</li>
          <li>• 개인정보 취급자 최소화 및 정기 교육 실시</li>
        </ul>
        <ul className="text-sm leading-relaxed text-gray-500 space-y-1">
          <li>• Data transmission protection via SSL encryption</li>
          <li>• Access control and database security via Supabase</li>
          <li>• Minimizing personnel with access to personal data and regular training</li>
        </ul>
      </section>
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">6. 이용자의 권리 / Your Rights</h2>
        <p className="text-sm leading-relaxed text-gray-700 mb-2">이용자는 언제든지 자신의 개인정보 열람, 수정, 삭제, 처리 정지를 요청할 수 있습니다. 요청은 girr.official@gmail.com으로 연락하시기 바랍니다.</p>
        <p className="text-sm leading-relaxed text-gray-500">Users may request access, correction, deletion, or suspension of processing of their personal information at any time. Please contact us at girr.official@gmail.com.</p>
      </section>
      <p className="text-xs text-gray-400 mt-12">시행일 / Effective Date: 2025년 8월 1일 | 개인정보 보호책임자: 이미현 | girr.official@gmail.com</p>
    </main>
  )
}