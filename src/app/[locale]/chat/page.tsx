import { notFound } from 'next/navigation'
import { ChatExperience } from '@/components/ChatExperience'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale, type Locale } from '@/i18n/config'

type ChatPageProps = {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ prompt?: string | string[] }>
}

export async function generateMetadata({ params }: ChatPageProps) {
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : 'en'
  const dictionary = getDictionary(locale)

  return {
    title: `${dictionary.pages.chatTitle} | ${dictionary.brand}`,
    description: dictionary.pages.chatIntro,
  }
}

export default async function ChatPage({ params, searchParams }: ChatPageProps) {
  const { locale: rawLocale } = await params
  const resolvedSearchParams = await searchParams
  const prompt = Array.isArray(resolvedSearchParams?.prompt)
    ? resolvedSearchParams?.prompt[0]
    : resolvedSearchParams?.prompt

  if (!isLocale(rawLocale)) {
    notFound()
  }

  return <ChatExperience initialPrompt={prompt} locale={rawLocale as Locale} />
}
