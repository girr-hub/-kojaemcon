import DOMPurify from 'isomorphic-dompurify'

export const sanitizeHtml = (dirty: string) =>
  DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p','br','strong','em','u','h1','h2','h3','h4','ul','ol','li','a','img','blockquote','code','pre','iframe','span','div'],
    ALLOWED_ATTR: ['href','src','alt','target','rel','class','style','allow','allowfullscreen','frameborder','width','height'],
    ALLOWED_URI_REGEXP: /^(https?|mailto):/,
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow','allowfullscreen','frameborder'],
  })
