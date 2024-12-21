export default function NotFound() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Sayfa Bulunamadı</h2>
          <p className="text-gray-500">
            Aradığınız sayfa bulunamadı. Lütfen URL'i kontrol edin.
          </p>
          <a 
            href="/login" 
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    )
  }