import '../styles/globals.css'
import { ConfigProvider, App } from 'antd'
import viVN from 'antd/locale/vi_VN'

// Global Ant Design theme and Vietnamese locale
export default function MyApp({ Component, pageProps }) {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
          fontFamily: "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif",
        },
      }}
    >
      <App>
        <Component {...pageProps} />
      </App>
    </ConfigProvider>
  )
}
