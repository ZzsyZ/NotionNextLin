import { useState, useEffect } from 'react'
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
  
  // 监听屏幕尺寸变化
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1600)
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    
    if (typeof window !== 'undefined') {
      handleResize() // 初始设置
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  const isLargeScreen = windowWidth >= 1540

  // 计算图片高度和容器高度
  const imageHeight = windowWidth * 0.3 * 9 / 16
  const containerMinHeight = isLargeScreen ? imageHeight + 128 : 0
  
  return (
    <div
      key={post.id}
      className={`my-0 border-b border-[#cccccc] dark:border-gray-200 p-4 min-[1540px]:p-16 blog-item-${post.id}`}
      style={{
        minHeight: isLargeScreen ? `${containerMinHeight}px` : 'auto',
        transition: 'min-height 0.3s ease'
      }}>
      
      {/* 强制样式覆盖 */}
      {isLargeScreen && (
        <style dangerouslySetInnerHTML={{
          __html: `
            .blog-item-${post.id} {
              min-height: ${containerMinHeight}px !important;
            }
          `
        }} />
      )}
      
      <div className='flex flex-col min-[1540px]:flex-row min-[1540px]:justify-between gap-6'>
        {/* 图片封面（上方/右侧） */}
        {showPageCover && (
          <div className='article-cover flex-shrink-0 min-[1540px]:order-2'>
            <div className='overflow-hidden w-full h-[56.25vw] min-[1540px]:w-[30vw] min-[1540px]:h-[16.875vw]'>
              <SmartLink href={post.href} passHref legacyBehavior>
                <LazyImage
                  src={post?.pageCoverThumbnail}
                  className='w-full h-full object-cover object-center cursor-pointer'
                />
              </SmartLink>
            </div>
          </div>
        )}

        <article className='article-info flex-1 min-[1540px]:mr-6 min-[1540px]:order-1'>
          {/* 第一行：分类和时间 */}
          <div className='flex items-baseline mt-3 mb-0.5 min-[1540px]:mt-0 min-[1540px]:mb-4'>
            {post.category && (
              <span className='text-black text-[8px] min-[1540px]:text-[32px] font-normal'>
                {post.category}
              </span>
            )}
            <span className='text-[#808080] text-[4px] min-[1540px]:text-[24px] font-normal ml-1 min-[1540px]:ml-4'>
              {post.date?.start_date || post.createdTime}
            </span>
          </div>

          {/* 第二行：文章标题 */}
          <div 
            className='mb-0 mt-0 min-[1540px]:mt-0 leading-normal font-medium text-[12px] min-[1540px]:text-[40px]'
            style={{
              lineHeight: '1.5'
            }}>
            <SmartLink
              href={post.href}
              className='blog-item-title menu-link block'>
              {siteConfig('POST_TITLE_ICON') && (
                <NotionIcon icon={post.pageIcon} />
              )}
              {post.title}
            </SmartLink>
          </div>

          {/* 第三行：文章摘要 - 包含按钮的容器 */}
          <div className='flex items-end justify-between min-[1540px]:block'>
            <div 
              className='text-[#808080] dark:text-[#808080] leading-normal mt-0 mb-0 min-[1540px]:mb-8 font-medium text-[12px] min-[1540px]:text-[40px] overflow-hidden cursor-pointer flex-1 min-[1540px]:block'
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.5'
              }}>
              <SmartLink href={post.href} className='text-[#808080] dark:text-[#808080]'>
                {post.summary}
              </SmartLink>
            </div>

            {/* 继续阅读按钮 - 在上下布局时与摘要底部对齐并右对齐 */}
            <div className='ml-2 min-[1540px]:ml-0 min-[1540px]:mt-8'>
              <SmartLink
                href={post.href}
                className='inline-flex items-center justify-center w-[60px] h-[28px] text-[12px] min-[1540px]:w-[120px] min-[1540px]:h-[56px] min-[1540px]:text-[28px] bg-[#F5F5F5] hover:bg-[#EAEAEA] text-black font-medium rounded-[14px] min-[1540px]:rounded-[28px] transition-all duration-200'>
                More
              </SmartLink>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
