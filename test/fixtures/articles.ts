import type { Article, ArticleDetail } from '@/lib/types';

export const releaseArticle: Article = {
  id: 130495,
  title: 'v16.4.0-canary.61',
  summary:
    'Bản phát hành v16.4.0-canary.61 mang đến các cải tiến hiệu năng cho Turbopack, ổn định các hàm forbidden() và unauthorized(), đồng thời hỗ trợ ESLint 10. Ngoài ra, bản cập nhật này còn tối ưu hóa Partial Prefetching, cơ chế cache và sửa một số lỗi trong quá trình build và runtime.',
  category: 'frontend',
  source: 'nextjs-releases',
  publishedAt: null,
  sortAt: '2026-10-06T08:00:00+00:00',
  thumbnail: 'https://avatars.githubusercontent.com/in/3491438?s=60&v=4',
  url: 'https://github.com/vercel/next.js/releases/tag/v16.4.0-canary.61',
};

export const bunReleaseArticle: Article = {
  id: 1146,
  title: 'Bun v1.3.13',
  summary:
    'Bun v1.3.13 đã được phát hành với hướng dẫn cài đặt và nâng cấp trên các nền tảng khác nhau. Cảm ơn 8 người đóng góp đã hỗ trợ phiên bản này!',
  category: 'runtime',
  source: 'bun-releases',
  publishedAt: null,
  sortAt: '2026-10-01T11:01:11+00:00',
  thumbnail: 'https://avatars.githubusercontent.com/u/709451?s=60&v=4',
  url: 'https://github.com/oven-sh/bun/releases/tag/bun-v1.3.13',
};

export const coindeskArticle: Article = {
  id: 130590,
  title:
    'Fairshake, cánh tay vận động chiến dịch của ngành crypto, lập danh sách các ứng viên Hạ viện Mỹ được ưu tiên tài trợ',
  summary:
    'Super PAC Fairshake thuộc ngành crypto đã công bố danh sách các ứng viên Hạ viện Mỹ nhận được tài trợ tài chính cho chiến dịch tranh cử sắp tới. Động thái này nhằm mục đích ủng hộ các nhà lập pháp có lập trường thân thiện và thúc đẩy các chính sách có lợi cho thị trường tài sản kỹ thuật số.',
  category: 'crypto',
  source: 'coindesk',
  publishedAt: '2026-10-05T19:21:06+00:00',
  sortAt: '2026-10-05T19:21:06+00:00',
  thumbnail:
    'https://cdn.sanity.io/images/s3y3vcno/production/f2ac925a7a768a3a034001f0cf6c3ecdc6749b81-4000x2250.jpg?fm=jpg&w=1920&h=1080&crop=focalpoint&fit=clip',
  url: 'https://www.coindesk.com/policy/2026/10/05/crypto-s-campaign-arm-fairshake-sets-lists-of-u-s-house-favorites-it-ll-spend-on',
};

export const releaseArticleDetail: ArticleDetail = {
  ...releaseArticle,
  content:
    'Bài viết tóm tắt các thay đổi chính của Next.js phiên bản v16.4.0-canary.61.\n\nPhiên bản này cải thiện cache trong Turbopack.\n\nỔn định hàm forbidden() và unauthorized().',
};

export const coindeskArticleDetail: ArticleDetail = { ...coindeskArticle, content: null };

export function createArticle(overrides: Partial<Article> = {}): Article {
  return { ...coindeskArticle, ...overrides };
}
