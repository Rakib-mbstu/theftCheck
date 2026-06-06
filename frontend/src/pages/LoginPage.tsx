import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="bg-brand-card rounded-2xl shadow-card-md p-8 sm:p-10 text-center w-full max-w-sm border border-brand-border">
        <div className="w-14 h-14 bg-brand-subtle rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
          🔍
        </div>
        <h1 className="text-brand-text text-2xl sm:text-3xl font-bold mb-2">TheftCheck</h1>
        <p className="text-brand-muted text-sm leading-relaxed mb-8">
          Sign in with Google to access your account.
        </p>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                await login(credentialResponse.credential!)
                navigate('/')
              } catch (e) {
                console.error('Login failed', e)
              }
            }}
            onError={() => console.error('Google login failed')}
          />
        </div>
      </div>
    </div>
  )
}
