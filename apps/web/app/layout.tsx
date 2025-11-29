export const metadata = {
  title: 'TimeMosaic',
  description: 'Tag-driven cross-era timeline'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}

