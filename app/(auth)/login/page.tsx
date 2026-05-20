import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="mx-auto mt-24 max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
      <h1 className="mb-2 text-2xl font-medium">Вход в VibeMap</h1>
      <p className="mb-8 text-sm text-zinc-400">
        Получите ссылку на почту — мы откроем вас Вайбу
      </p>
      <LoginForm />
    </div>
  )
}
