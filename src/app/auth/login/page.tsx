"use client"

import { Login } from '@/components/log-monitoring/login'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = (status: boolean) => {
    if (status) {
      Cookies.set('auth', 'true', { expires: 1 })
      router.push('/dashboard/logs')
    }
  }

  return <Login onLogin={handleLogin} />
}