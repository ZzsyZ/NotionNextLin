import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

export const BlogItem = props => {
  const { post } = props
  const { NOTION_CONFIG } = useGlobal()
  const showPageCover = siteConfig('SIMPLE_POST_COVER_ENABLE', false, CONFIG)
  const showPreview =
    siteConfig('POST_LIST_PREVIEW', false, NOTION_CONFIG) && post.blockMap

  return (
    <div
      key={post.id}
      className='min-h-42 my-0 border-b border-[#cccccc] dark:border-gray-200 p-4 sm:p-8 md:p-12 lg:p-16'>
      <div className='flex flex-col lg:flex-row lg:justify-between gap-6'>
        <article className='article-info flex-1 lg:mr-6'>
          {/* 第一行：分类和时间 */}
          <div className='flex items-baseline mb-4'>
            {post.category && (
              <span className='text-black text-[32px] font-normal'>
                {post.category}
              </span>
            )}
            <span className='text-[#808080] text-[24px] font-normal ml-4'>
              {post.date?.start_date || post.createdTime}
            </span>
          </div>

          {/* 第二行：文章标题 */}
          <h2 className='mb-0'>
            <SmartLink
              href={post.href}
              className='blog-item-title font-medium text-[40px] menu-link'>
              {siteConfig('POST_TITLE_ICON') && (
                <NotionIcon icon={post.pageIcon} />
              )}
              {post.title}
            </SmartLink>
          </h2>

          {/* 第三行：文章摘要 */}
          <SmartLink href={post.href}>
            <div 
              className='text-[#808080] dark:text-[#808080] leading-normal mt-0 mb-8 font-medium text-[40px] overflow-hidden cursor-pointer'
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.2'
              }}>
              {post.summary}
            </div>
          </SmartLink>

          {/* 继续阅读按钮 */}
          <div className='mt-8'>
            <SmartLink
              href={post.href}
              className='inline-flex items-center justify-center w-[120px] h-[56px] sm:w-[100px] sm:h-[48px] md:w-[110px] md:h-[52px] lg:w-[120px] lg:h-[56px] bg-[#F5F5F5] hover:bg-[#EAEAEA] text-black text-[28px] sm:text-[20px] md:text-[24px] lg:text-[28px] font-medium rounded-[28px] sm:rounded-[20px] md:rounded-[24px] lg:rounded-[28px] transition-all duration-200'>
              More
            </SmartLink>
          </div>
        </article>

        {/* 图片封面（右侧） */}
        {showPageCover && (
          <div className='article-cover flex-shrink-0'>
            <div className='overflow-hidden w-full h-48 sm:w-80 sm:h-48 md:w-96 md:h-56 lg:w-[576px] lg:h-[324px]'>
              <SmartLink href={post.href} passHref legacyBehavior>
                <LazyImage
                  src={post?.pageCoverThumbnail}
                  className='w-full h-full object-cover object-center cursor-pointer'
                />
              </SmartLink>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
