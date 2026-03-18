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
          colorPrimary: '#0043a5',
          borderRadius: 5,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
          fontSize: 14,
          colorBgBase: '#fefefe',
        },
        components: {
          Button: { borderRadius: 5 },
          Table: { borderRadius: 0 },
        },
      }}
    >
      <App>
        <Component {...pageProps} />
      </App>
    </ConfigProvider>
  )
}
