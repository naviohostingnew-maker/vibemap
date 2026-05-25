import { redirect } from 'next/navigation'

// Root entry. The create-next-app boilerplate that shipped at bootstrap has been removed. For
// the v0.2 prototype the bare URL lands on the catalog (a no-auth v0.2 surface) so the review
// link opens straight into the prototype. The production auth entry (login → onboarding → feed)
// is a separate task and not decided here.
export default function Home() {
  redirect('/catalog')
}
