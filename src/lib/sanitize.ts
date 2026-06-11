export const sanitizeHtml = (dirty: string): string => {
  if (!dirty) return ''
  // 서버사이드에서는 그냥 반환 (Vercel 서버리스 환경)
  return dirty
}
