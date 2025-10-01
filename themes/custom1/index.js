/**
 * Custom1主题的入口文件
 * 包含了整个主题的布局结构和页面组织
 */

// 引入全局公共组件
import { AdSlot } from '@/components/GoogleAdsense'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef } from 'react'
import BlogPostBar from './components/BlogPostBar'
import CONFIG from './config'
import { Style } from './style'

// 搜索模态框组件 - 使用动态导入以优化首屏加载
const AlgoliaSearchModal = dynamic(
  () => import('@/components/AlgoliaSearchModal'),
  { ssr: false }
)

// 主题组件 - 全部使用动态导入以优化性能
// 文章列表相关组件
const BlogListScroll = dynamic(() => import('./components/BlogListScroll'), { // 滚动加载的文章列表
  ssr: false
})
const BlogListPage = dynamic(() => import('./components/BlogListPage'), { // 分页形式的文章列表
  ssr: false
})
const BlogArchiveItem = dynamic(() => import('./components/BlogArchiveItem'), { // 归档页的文章项
  ssr: false
})

// 文章详情页相关组件
const ArticleLock = dynamic(() => import('./components/ArticleLock'), { // 文章加密锁定组件
  ssr: false
})
const ArticleInfo = dynamic(() => import('./components/ArticleInfo'), { // 文章信息展示
  ssr: false
})
const ArticleAround = dynamic(() => import('./components/ArticleAround'), { // 上一篇/下一篇导航
  ssr: false
})
const RecommendPosts = dynamic(() => import('./components/RecommendPosts'), { // 推荐文章
  ssr: false
})

// 布局结构组件
const TopBar = dynamic(() => import('./components/TopBar'), { // 顶部工具栏
  ssr: false
})
const Header = dynamic(() => import('./components/Header'), { // 站点头部
  ssr: false
})
const NavBar = dynamic(() => import('./components/NavBar'), { // 导航栏
  ssr: false
})
const SideBar = dynamic(() => import('./components/SideBar'), { // 侧边栏
  ssr: false
})
const Footer = dynamic(() => import('./components/Footer'), { // 页脚
  ssr: false
})

// 功能性组件
const Comment = dynamic(() => import('@/components/Comment'), { ssr: false }) // 评论系统
const ShareBar = dynamic(() => import('@/components/ShareBar'), { ssr: false }) // 分享工具栏
const SearchInput = dynamic(() => import('./components/SearchInput'), { // 搜索输入框
  ssr: false
})
const JumpToTopButton = dynamic(() => import('./components/JumpToTopButton'), { // 返回顶部按钮
  ssr: false
})
const WWAds = dynamic(() => import('@/components/WWAds'), { ssr: false }) // 广告组件

/**
 * 主题全局状态管理
 * 使用 React Context API 创建一个主题级别的状态管理器
 * 主要用于管理搜索模态框等全局状态
 */
const ThemeGlobalSimple = createContext()
export const useSimpleGlobal = () => useContext(ThemeGlobalSimple)

/**
 * 基础布局组件 - 整个主题的骨架结构
 * 包含了页面的基本布局结构，如导航栏、内容区、侧边栏等
 * 所有页面都基于这个基础布局构建
 * 
 * @param {Object} props 组件属性
 * @param {ReactNode} props.children 子组件，通常是页面主体内容
 * @param {ReactNode} props.slotTop 顶部插槽内容
 * @returns {JSX.Element} 返回页面骨架结构
 */
const LayoutBase = props => {
  const { children, slotTop } = props
  const { onLoading, fullWidth } = useGlobal()
  const searchModal = useRef(null)

  return (
    <ThemeGlobalSimple.Provider value={{ searchModal }}>
      <div
        id='theme-simple'
        className={`${siteConfig('FONT_STYLE')} min-h-screen flex flex-col dark:text-gray-300  bg-white dark:bg-black scroll-smooth`}>
        <Style />

        {siteConfig('SIMPLE_TOP_BAR', null, CONFIG) && <TopBar {...props} />}
        {/* 导航栏 */}
        <NavBar {...props} />
        {/* 顶部LOGO */}
        { /* <Header {...props} /> */ }


        {/* 主体 */}
        <div
          id='container-wrapper'
          className='w-full flex-1 flex items-start max-w-[1600px] mx-auto pt-12 px-4'>
          <div id='container-inner' className='w-full flex-grow min-h-fit'>
            <Transition
              show={!onLoading}
              appear={true}
              enter='transition ease-in-out duration-700 transform order-first'
              enterFrom='opacity-0 translate-y-16'
              enterTo='opacity-100'
              leave='transition ease-in-out duration-300 transform'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 -translate-y-16'
              unmount={false}>
              {slotTop}

              {children}
            </Transition>
            <AdSlot type='native' />
          </div>
        </div>

        <div className='fixed right-4 bottom-4 z-20'>
          <JumpToTopButton />
        </div>

        {/* 搜索框 */}
        <AlgoliaSearchModal cRef={searchModal} {...props} />

        <Footer {...props} />
      </div>
    </ThemeGlobalSimple.Provider>
  )
}

/**
 * 博客首页布局组件
 * 本质上是博客文章列表的展示页面
 * 复用了 LayoutPostList 组件的功能
 * 
 * @param {Object} props 组件属性，会直接传递给 LayoutPostList
 * @returns {JSX.Element} 博客首页视图
 */
const LayoutIndex = props => {
  return <LayoutPostList {...props} />
}

/**
 * 博客文章列表布局组件
 * 可以通过配置以分页或滚动加载的方式展示文章列表
 * 包含了文章导航栏和文章列表两个主要部分
 * 
 * @param {Object} props 组件属性
 * @returns {JSX.Element} 文章列表页面
 */
const LayoutPostList = props => {
  return (
    <>
      <BlogPostBar {...props} />
      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <BlogListPage {...props} />
      ) : (
        <BlogListScroll {...props} />
      )}
    </>
  )
}

/**
 * 搜索结果页面布局组件
 * 基于博客列表布局，但增加了搜索关键词高亮和搜索输入框功能
 * 支持 Algolia 搜索和内置搜索两种模式
 * 
 * @param {Object} props 组件属性
 * @param {string} props.keyword 搜索关键词
 * @returns {JSX.Element} 搜索结果页面
 */
const LayoutSearch = props => {
  const { keyword } = props

  useEffect(() => {
    if (isBrowser) {
      replaceSearchResult({
        doms: document.getElementById('posts-wrapper'),
        search: keyword,
        target: {
          element: 'span',
          className: 'text-red-500 border-b border-dashed'
        }
      })
    }
  }, [])

  const slotTop = siteConfig('ALGOLIA_APP_ID') ? null : (
    <SearchInput {...props} />
  )

  return <LayoutPostList {...props} slotTop={slotTop} />
}

/**
 * 归档页面布局组件
 * 按时间顺序展示所有文章的归档视图
 * 文章按照时间分组展示，支持年份和月份的层级展示
 * 
 * @param {Object} props 组件属性
 * @param {Object} props.archivePosts 按时间分组的文章数据
 * @returns {JSX.Element} 归档页面
 */
const LayoutArchive = props => {
  const { archivePosts } = props
  return (
    <>
      <div className='mb-10 pb-20 md:py-12 p-3  min-h-screen w-full'>
        {Object.keys(archivePosts).map(archiveTitle => (
          <BlogArchiveItem
            key={archiveTitle}
            archiveTitle={archiveTitle}
            archivePosts={archivePosts}
          />
        ))}
      </div>
    </>
  )
}

/**
 * 文章详情页面布局组件
 * 展示单篇文章的完整内容，包括:
 * - 文章信息(标题、作者、发布时间等)
 * - 文章主体内容(Notion渲染)
 * - 文章互动功能(分享、评论等)
 * - 相关文章推荐
 * 支持文章加密功能
 * 
 * @param {Object} props 组件属性
 * @param {Object} props.post 文章数据对象
 * @param {boolean} props.lock 文章是否加密
 * @param {boolean} props.validPassword 密码是否有效
 * @param {Object} props.prev 上一篇文章
 * @param {Object} props.next 下一篇文章
 * @param {Array} props.recommendPosts 推荐文章列表
 * @returns {JSX.Element} 文章详情页面
 */
const LayoutSlug = props => {
  const { post, lock, validPassword, prev, next, recommendPosts } = props
  const { fullWidth } = useGlobal()

  return (
    <>
      {lock && <ArticleLock validPassword={validPassword} />}

      {!lock && post && (
        <div className={`px-2  ${fullWidth ? '' : 'xl:max-w-4xl 2xl:max-w-6xl'}`}>
          {/* 文章信息 */}
          <ArticleInfo post={post} />

          {/* 广告嵌入 */}
          {/* <AdSlot type={'in-article'} /> */}
          <WWAds orientation='horizontal' className='w-full' />

          <div id='article-wrapper'>
            {/* Notion文章主体 */}
            {!lock && <NotionPage post={post} />}
          </div>

          {/* 分享 */}
          <ShareBar post={post} />

          {/* 广告嵌入 */}
          <AdSlot type={'in-article'} />

          {post?.type === 'Post' && (
            <>
              <ArticleAround prev={prev} next={next} />
              <RecommendPosts recommendPosts={recommendPosts} />
            </>
          )}

          {/* 评论区 */}
          <Comment frontMatter={post} />
        </div>
      )}
    </>
  )
}

/**
 * 404错误页面布局组件
 * 处理页面未找到的情况
 * 包含自动检测和跳转逻辑：
 * - 等待一定时间检查页面是否加载
 * - 如果页面仍未加载成功则跳转到404页面
 * 
 * @param {Object} props 组件属性
 * @param {Object} props.post 文章数据(如果有)
 * @returns {JSX.Element} 404页面
 */
const Layout404 = props => {
  const { post } = props
  const router = useRouter()
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000
  useEffect(() => {
    // 404
    if (!post) {
      setTimeout(
        () => {
          if (isBrowser) {
            const article = document.querySelector('#article-wrapper #notion-article')
            if (!article) {
              router.push('/404').then(() => {
                console.warn('找不到页面', router.asPath)
              })
            }
          }
        },
        waiting404
      )
    }
  }, [post])
  return <>404 Not found.</>
}

/**
 * 分类列表页面布局组件
 * 展示所有文章分类及其文章数量
 * 每个分类项都是可点击的链接，跳转到对应分类的文章列表
 * 
 * @param {Object} props 组件属性
 * @param {Array} props.categoryOptions 分类选项列表，每项包含分类名称和文章数量
 * @returns {JSX.Element} 分类列表页面
 */
const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  return (
    <>
      <div id='category-list' className='duration-200 flex flex-wrap'>
        {categoryOptions?.map(category => {
          return (
            <SmartLink
              key={category.name}
              href={`/category/${category.name}`}
              passHref
              legacyBehavior>
              <div
                className={
                  'hover:text-black dark:hover:text-white dark:text-gray-300 dark:hover:bg-gray-600 px-5 cursor-pointer py-2 hover:bg-gray-100'
                }>
                <i className='mr-4 fas fa-folder' />
                {category.name}({category.count})
              </div>
            </SmartLink>
          )
        })}
      </div>
    </>
  )
}

/**
 * 标签列表页面布局组件
 * 展示所有文章标签的云图
 * 特点：
 * - 支持标签颜色自定义
 * - 显示每个标签的文章数量
 * - 标签点击后跳转到该标签的文章列表
 * - 响应式布局，自适应不同屏幕尺寸
 * 
 * @param {Object} props 组件属性
 * @param {Array} props.tagOptions 标签选项列表，每项包含标签名称、颜色和文章数量
 * @returns {JSX.Element} 标签列表页面
 */
const LayoutTagIndex = props => {
  const { tagOptions } = props
  return (
    <>
      <div id='tags-list' className='duration-200 flex flex-wrap'>
        {tagOptions.map(tag => {
          return (
            <div key={tag.name} className='p-2'>
              <SmartLink
                key={tag}
                href={`/tag/${encodeURIComponent(tag.name)}`}
                passHref
                className={`cursor-pointer inline-block rounded hover:bg-gray-500 hover:text-white duration-200  mr-2 py-1 px-2 text-xs whitespace-nowrap dark:hover:text-white text-gray-600 hover:shadow-xl dark:border-gray-400 notion-${tag.color}_background dark:bg-gray-800`}>
                <div className='font-light dark:text-gray-400'>
                  <i className='mr-1 fas fa-tag' />{' '}
                  {tag.name + (tag.count ? `(${tag.count})` : '')}{' '}
                </div>
              </SmartLink>
            </div>
          )
        })}
      </div>
    </>
  )
}

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
