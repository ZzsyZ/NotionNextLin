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
      className={`my-0 border-b border-[#cccccc] dark:border-gray-200 py-4 px-10 min-[1540px]:p-16 blog-item-${post.id}`}
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
      
      <div className='flex flex-col min-[1540px]:flex-row min-[1540px]:justify-between gap-0 min-[1540px]:gap-6'>
        {/* 图片封面（上方/右侧） */}
        {showPageCover && (
          <div className='article-cover flex-shrink-0 min-[1540px]:order-2'>
            <div className='overflow-hidden w-full aspect-video min-[1540px]:w-[30vw] min-[1540px]:h-[16.875vw] min-[1540px]:aspect-auto'>
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
          <div className='flex items-baseline mt-4 mb-0 min-[1540px]:mt-0 min-[1540px]:mb-4'>
            {post.category && (
              <span className='text-black text-[12px] min-[1540px]:text-[32px] font-normal min-[1540px]:px-1 min-[1540px]:py-0.5 leading-[17px] min-[1540px]:leading-[45px]'>
                {post.category}
              </span>
            )}
            <span className='text-[#808080] text-[8px] min-[1540px]:text-[24px] font-normal ml-1 min-[1540px]:ml-4 min-[1540px]:px-1 min-[1540px]:py-0.5 leading-[11px] min-[1540px]:leading-[34px]'>
              {post.date?.start_date || post.createdTime}
            </span>
          </div>

          {/* 内容和按钮的主容器 */}
          <div className={`${isLargeScreen ? 'block' : 'flex items-end gap-1'}`}>
            {/* 标题和摘要的文字单元 */}
            <div className={`${isLargeScreen ? 'w-full' : 'flex-1'}`}>
              {/* 文章标题 */}
              <div 
                className='mb-0 mt-1 min-[1540px]:mt-0 font-medium text-[16px] min-[1540px]:text-[40px] leading-[22px] min-[1540px]:leading-[56px]'
                style={{
                  display: !isLargeScreen ? '-webkit-box' : 'block',
                  WebkitLineClamp: !isLargeScreen ? 1 : 'unset',
                  WebkitBoxOrient: !isLargeScreen ? 'vertical' : 'unset',
                  overflow: !isLargeScreen ? 'hidden' : 'visible'
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

              {/* 文章摘要 - 紧贴标题 */}
              <div 
                className={`${
                  isLargeScreen 
                    ? 'text-[#808080] dark:text-[#808080] mb-8 font-medium text-[40px] overflow-hidden cursor-pointer block leading-[56px]' 
                    : 'text-[#808080] dark:text-[#808080] font-medium text-[16px] overflow-hidden cursor-pointer leading-[22px]'
                }`}
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: isLargeScreen ? 2 : 1,
                  WebkitBoxOrient: 'vertical'
                }}>
                <SmartLink href={post.href} className='text-[#808080] dark:text-[#808080]'>
                  {post.summary}
                </SmartLink>
              </div>
            </div>

            {/* 继续阅读按钮 - 小屏幕与文字单元底部对齐 */}
            {!isLargeScreen && (
              <div className='flex-shrink-0'>
                <SmartLink
                  href={post.href}
                  className='inline-flex items-center justify-center w-[60px] h-[28px] text-[12px] bg-[#F5F5F5] hover:bg-[#EAEAEA] text-black font-medium rounded-[14px] transition-all duration-200'>
                  More
                </SmartLink>
              </div>
            )}
            
            {/* 继续阅读按钮 - 大屏幕 */}
            {isLargeScreen && (
              <div className='mt-8'>
                <SmartLink
                  href={post.href}
                  className='inline-flex items-center justify-center w-[120px] h-[56px] text-[28px] bg-[#F5F5F5] hover:bg-[#EAEAEA] text-black font-medium rounded-[28px] transition-all duration-200'>
                  More
                </SmartLink>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
