import { Feed, Item } from 'feed'
import removeMd from 'remove-markdown'
import { BlogPostProps } from '../interfaces'
import { SITE_URL, URL_CATEGORIES_MAP } from '../constants'

export const generateRssFeed = async (
  posts: BlogPostProps[],
  category?: keyof typeof URL_CATEGORIES_MAP
): Promise<Feed> => {
  const date = new Date()
  const feed = new Feed({
    title: 'Solidity Lang Blog',
    description: '',
    id: SITE_URL,
    link: SITE_URL,
    image: `${SITE_URL}/assets/solidity-logo.svg`,
    favicon: `${SITE_URL}/assets/solidity-logo.svg`,
    copyright: `All rights reserved ${date.getFullYear()}`,
    updated: date,
    feedLinks: {
      rss2: `${SITE_URL}/rss/feed.xml`,
    },
  })
  posts
    .filter(
      ({ frontmatter: { category: frontmatterCategory } }) =>
        !category || frontmatterCategory === URL_CATEGORIES_MAP[category]
    )
    .forEach(
      ({ frontmatter: { title, date, author, category }, content, url }) => {
        const link = `${SITE_URL}/${url}`
        const categoryOfPost = [{ name: category }]
        const authorOfPost = [{ name: author }]
        const MAX_WORDS = 50
        const trimmedContent = removeMd(content.slice(0, MAX_WORDS * 10))
        const trimmedContentArray = trimmedContent
          .replace(/\n/gm, ' ')
          .trim()
          .split(' ')
        const sliceEnd =
          trimmedContentArray.length < MAX_WORDS
            ? trimmedContentArray.length
            : MAX_WORDS
        const previewContent = trimmedContentArray
          .slice(0, sliceEnd)
          .join(' ')
          .concat('...')

        const item = {
          title,
          id: link,
          link,
          date: new Date(date),
          description: previewContent,
          category: categoryOfPost,
          author: authorOfPost,
          contributor: authorOfPost,
          published: new Date(date),
          guid: link,
        } as Item

        feed.addItem(item)
      }
    )
  return feed
}
