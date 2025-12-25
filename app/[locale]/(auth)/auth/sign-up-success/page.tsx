import { Link } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"
import { connection } from "next/server"
import { CheckCircle, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr"

export default async function SignUpSuccessPage() {
  await connection()
  const t = await getTranslations('Auth')

  return (
    <div className="min-h-svh flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 relative">
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            {/* Success Icon */}
            <div className="size-14 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircle className="size-8 text-emerald-600" weight="fill" />
            </div>
            
            <h1 className="text-xl font-semibold text-gray-900">
              {t('signUpSuccessTitle')}
            </h1>
            <p className="text-sm text-gray-500 mt-1 text-center">
              {t('signUpSuccessDescription')}
            </p>
          </div>

          {/* Email Notice */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg text-left mb-6">
            <EnvelopeSimple className="size-5 text-blue-600 shrink-0 mt-0.5" weight="duotone" />
            <div>
              <p className="text-sm font-medium text-gray-900 mb-0.5">{t('checkYourEmail')}</p>
              <p className="text-xs text-gray-600">{t('confirmEmailInstructions')}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
            >
              {t('goToSignIn')}
            </Link>
            <Link
              href="/"
              className="w-full h-10 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              {t('backToHome')}
            </Link>
          </div>

          <p className="text-xs text-center text-gray-500 mt-4">
            {t('didNotReceiveEmail')}{" "}
            <button className="text-blue-600 hover:underline">{t('resendEmail')}</button>
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
