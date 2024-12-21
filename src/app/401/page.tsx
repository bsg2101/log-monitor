"use client"

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldOff } from 'lucide-react' // lucide-react ikonları kullanıyoruz

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <ShieldOff className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-600">401 - Yetkisiz Erişim</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-gray-600">
              Bu sayfaya erişim yetkiniz bulunmamaktadır.
            </p>
            <p className="text-sm text-gray-500">
              Lütfen giriş yapın veya yetkinizi kontrol edin.
            </p>
          </div>
          <div className="flex justify-center pt-2">
            <Button 
              onClick={() => router.push('/auth/login')}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Giriş Sayfasına Dön
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}