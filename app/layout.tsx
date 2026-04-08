export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru">
        <head><script src="https://cdn.tailwindcss.com"></script></head>
        <body style={{margin: 0, backgroundColor: '#09090b'}}>{children}</body>
        </html>
    )
}
