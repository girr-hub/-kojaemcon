export default function RefundPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-2">환불 정책</h1>
      <p className="text-sm text-gray-500 mb-10">Refund Policy</p>
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">참가자 취소 시 환불 기준 / Cancellation by Participant</h2>
        <div className="overflow-x-auto mb-2">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2 text-left">취소 시점 / Timing</th>
                <th className="border border-gray-200 px-4 py-2 text-left">환불 금액 / Refund Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-4 py-2">행사 7일 전까지 / 7+ days before event</td>
                <td className="border border-gray-200 px-4 py-2">전액 환불 / Full refund</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-4 py-2">행사 3~6일 전 / 3-6 days before event</td>
                <td className="border border-gray-200 px-4 py-2">50% 환불 / 50% refund</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-2">행사 2일 전~당일 / 0-2 days before event</td>
                <td className="border border-gray-200 px-4 py-2">환불 불가 / No refund</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">주최 측 취소 시 환불 / Cancellation by Organizer</h2>
        <p className="text-sm leading-relaxed text-gray-700 mb-2">회사 사정 또는 운영상 문제로 행사가 취소되는 경우, 결제 금액 전액을 환불합니다. 환불은 영업일 기준 3~5일 이내 처리됩니다.</p>
        <p className="text-sm leading-relaxed text-gray-500">If an event is cancelled due to the Company circumstances or operational issues, a full refund will be issued within 3-5 business days.</p>
      </section>
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">불가항력 상황 / Force Majeure</h2>
        <p className="text-sm leading-relaxed text-gray-700 mb-2">태풍, 폭설, 지진 등 천재지변 또는 정부의 집합금지 명령 등 불가항력적 사유로 행사가 취소되는 경우 전액 환불합니다. 단, 기상 악화로 일부 일정이 변경되는 경우는 환불 대상이 아닙니다.</p>
        <p className="text-sm leading-relaxed text-gray-500">Full refunds are provided when events are cancelled due to force majeure. Partial schedule changes due to weather do not qualify for a refund.</p>
      </section>
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">환불 절차 / Refund Procedure</h2>
        <ul className="text-sm leading-relaxed text-gray-700 space-y-1 mb-2">
          <li>① girr.official@gmail.com으로 이름, 예약 번호, 취소 사유를 포함한 환불 요청 이메일 발송</li>
          <li>② 확인 후 영업일 기준 3~5일 이내 원결제 수단으로 환불 처리</li>
          <li>③ 카드 환불의 경우 카드사 처리 일정에 따라 추가 소요될 수 있음</li>
        </ul>
        <ul className="text-sm leading-relaxed text-gray-500 space-y-1">
          <li>① Send a refund request to girr.official@gmail.com with your name, booking number, and reason.</li>
          <li>② Refunds are processed to the original payment method within 3-5 business days.</li>
          <li>③ Card refunds may take additional time depending on your card issuer.</li>
        </ul>
      </section>
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">환불 불가 조건 / Non-Refundable Conditions</h2>
        <ul className="text-sm leading-relaxed text-gray-700 space-y-1 mb-2">
          <li>• 행사 당일 노쇼(No-show)</li>
          <li>• 행사 시작 후 자의로 조기 퇴장하는 경우</li>
          <li>• 이용자 본인의 규정 위반으로 퇴장 조치된 경우</li>
        </ul>
        <ul className="text-sm leading-relaxed text-gray-500 space-y-1">
          <li>• No-show on the day of the event</li>
          <li>• Voluntary early departure after the event has started</li>
          <li>• Removal due to violation of rules</li>
        </ul>
      </section>
      <p className="text-xs text-gray-400 mt-12">문의 / Contact: girr.official@gmail.com | 주식회사 기르 | 사업자등록번호: 406-81-07423</p>
    </main>
  )
}