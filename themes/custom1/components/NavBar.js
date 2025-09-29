import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Transition } from '@headlessui/react'

/**
 * 顶部导航栏组件
 * @param {Object} props 组件属性
 * @returns {JSX.Element} 导航栏组件
 */
export default function NavBar(props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className='sticky top-0 w-full bg-white z-30 dark:bg-black border-b dark:border-gray-800'>
      <div className='h-24 px-4 mx-auto flex items-center max-w-9/10'>
        {/* Logo和菜单容器 */}
        <div className='flex items-center space-x-6 relative z-30'>
          {/* Logo */}
          <Link href="/" className='flex items-center'>
            <Image
              src="/favicon.ico"
              alt="Logo"
              width={28}
              height={28}
              className="rounded-sm"
            />
          </Link>

          {/* 菜单按钮 */}
          <button
            onClick={toggleMenu}
            className="text-base hover:border-b border-gray-900 dark:border-gray-100 transition-all duration-200"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        {/* 侧边菜单抽屉 - 先添加一个简单的实现，后续会抽出为单独组件 */}
        <Transition
          show={isMenuOpen}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />
        </Transition>

        <Transition
          show={isMenuOpen}
          enter="transition-transform duration-300"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition-transform duration-300"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
          className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl transform z-20"
        >
          {/* 菜单内容 */}
          <div className="p-8">
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-4">菜单</h2>
              {/* 这里后续会使用 MenuList 组件 */}
            </div>
          </div>
        </Transition>
      </div>
    </nav>
  )
}
