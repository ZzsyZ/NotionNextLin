import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import DarkModeButton from '@/components/DarkModeButton'
import { siteConfig } from '@/lib/config'

/**
 * 页脚
 * @param {*} props
 * @returns
 */
export default function Footer(props) {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate =
    parseInt(since) < currentYear ? since + '-' + currentYear : currentYear

  return (
    <footer className='relative w-full bg-black px-6 border-t'>
      <DarkModeButton className='text-center pt-4' />

      <div className='container mx-auto max-w-4xl py-6 flex justify-center items-center'>
        <div className='text-center'>
          {siteConfig('BEI_AN') && (
            <a
              href={siteConfig('BEI_AN_LINK')}
              className='no-underline hover:underline'>
              {siteConfig('BEI_AN')}
            </a>
          )}
          <BeiAnGongAn />
        </div>
      </div>
    </footer>
  )
}
