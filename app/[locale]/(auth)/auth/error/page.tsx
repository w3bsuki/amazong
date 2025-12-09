import { Link } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"
import { WarningCircle, ArrowLeft } from "@phosphor-icons/react/dist/ssr"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; error_description?: string }>
}) {
  const params = await searchParams
  const t = await getTranslations('Auth')

  const getErrorMessage = (error?: string, description?: string) => {
    if (description) return description
    switch (error) {
      case 'access_denied': return t('errorAccessDenied')
      case 'invalid_request': return t('errorInvalidRequest')
      case 'unauthorized_client': return t('errorUnauthorized')
      case 'server_error': return t('errorServer')
      case 'verification_failed': return t('errorVerificationFailed') || 'Email verification failed. The link may have expired.'
      case 'invalid_code': return t('errorInvalidCode') || 'Invalid verification code. Please try signing up again.'
      default: return t('errorGeneric')
    }
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 relative">
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            {/* Error Icon */}
            <div className="size-14 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <WarningCircle className="size-8 text-red-600" weight="fill" />
            </div>
            
            <h1 className="text-xl font-semibold text-gray-900">
              {t('errorTitle')}
            </h1>
            <p className="text-sm text-gray-500 mt-1 text-center">
              {t('errorSubtitle')}
            </p>
          </div>

          {/* Error Details */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-left mb-6">
            <p className="text-sm text-red-700">
              {getErrorMessage(params.error, params.error_description)}
            </p>
            {params.error && (
              <p className="text-xs text-gray-500 mt-2">
                {t('errorCode')}: {params.error}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Link href="/auth/login" className="block">
              <button className="
                w-full h-10 
                bg-blue-600 hover:bg-blue-700
                text-white text-sm font-medium rounded-lg 
                transition-colors
                flex items-center justify-center
              ">
                {t('tryAgain')}
              </button>
            </Link>
            <Link href="/" className="block">
              <button className="
                w-full h-10 
                bg-white border border-gray-300 
                text-gray-700 text-sm font-medium rounded-lg 
                hover:bg-gray-50
                transition-colors 
                flex items-center justify-center gap-1.5
              ">
                <ArrowLeft className="size-4" />
                {t('backToHome')}
              </button>
            </Link>
          </div>

          <p className="text-xs text-center text-gray-500 mt-4">
            {t('needHelp')}{" "}
            <Link href="/help" className="text-blue-600 hover:underline">{t('contactSupport')}</Link>
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <div className="flex justify-center gap-4 text-xs text-gray-500">
            <Link href="/terms" className="hover:text-blue-600 transition-colors">{t('conditionsOfUse')}</Link>
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">{t('privacyNotice')}</Link>
            <Link href="/help" className="hover:text-blue-600 transition-colors">{t('help')}</Link>
          </div>
          <p className="text-xs text-center text-gray-400 mt-2">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </div>
  )
}
