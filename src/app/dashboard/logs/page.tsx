"use client"

import { useRouter } from 'next/navigation'
import LogMonitoring from '@/components/log-monitoring'
import Cookies from 'js-cookie'

export default function LogsPage() {
  const router = useRouter()

  const handleLogout = () => {
    // Önce cookie'yi temizle
    Cookies.remove('auth')
    
    // Login sayfasına yönlendir (düzeltilmiş path)
    router.push('/auth/login')
  }

  return <LogMonitoring onLogout={handleLogout} />
}