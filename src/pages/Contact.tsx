import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle } from 'lucide-react'
import { PROFILE } from '@/data/profile'
import { sendContact, getProfile } from '@/lib/api'
import { useApi } from '@/hooks/useApi'
import Seo from '@/components/Seo'

interface FormState {
  name: string
  email: string
  subject: string
  message: string
}

const INITIAL_FORM: FormState = { name: '', email: '', subject: '', message: '' }
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function Contact() {
  const { data: apiProfile } = useApi(getProfile)
  const profile = apiProfile ?? PROFILE

  const [form, setForm]           = useState<FormState>(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [errors, setErrors]         = useState<Partial<FormState>>({})

  const validate = (): boolean => {
    const e: Partial<FormState> = {}
    if (!form.name.trim())    e.name    = 'Required'
    if (!form.email.trim())   e.email   = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.subject.trim()) e.subject = 'Required'
    if (!form.message.trim()) e.message = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await sendContact(form)
      setSubmitted(true)
      setForm(INITIAL_FORM)
    } catch {
      setErrors({ message: 'Failed to send. Please email me directly.' })
    } finally {
      setSubmitting(false)
    }
  }

  const fieldProps = (key: keyof FormState) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  })

  const INFO = [
    { label: 'EMAIL',    value: profile.email,    href: `mailto:${profile.email}` },
    { label: 'PHONE',    value: profile.phone,    href: `tel:${profile.phone}` },
    { label: 'LOCATION', value: profile.location, href: undefined },
    { label: 'TIMEZONE', value: 'AST (UTC+3)',    href: undefined },
  ]

  return (
    <div className="pt-24 pb-20">
      <Seo title="Contact" description="Get in touch with Mohamed Alderdiry for ML engineering roles, research collaborations, and interesting problems." path="/contact" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-12"
        >
          <p className="font-mono text-xs text-brand-accent uppercase tracking-[0.2em] mb-3">// get in touch</p>
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-3">Contact</h1>
          <p className="text-brand-muted text-sm max-w-md">
            Open to ML engineering roles, research collaborations, and interesting problems.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Info side */}
          <motion.div
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
          >
            <div className="space-y-0 divide-y divide-brand-border/50">
              {INFO.map(({ label, value, href }) => (
                <div key={label} className="py-5 first:pt-0">
                  <p className="font-mono text-xs text-brand-accent uppercase tracking-[0.15em] mb-1">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm hover:text-brand-accent transition-colors duration-150">
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm">{value}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="mt-8 pt-6 border-t border-brand-border/50">
              <p className="font-mono text-xs text-brand-accent uppercase tracking-[0.15em] mb-4">Profiles</p>
              <div className="flex flex-col gap-3">
                <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer"
                   className="text-sm text-brand-muted hover:text-[var(--color-text)] transition-colors duration-150">
                  LinkedIn — {profile.linkedin}
                </a>
                <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer"
                   className="text-sm text-brand-muted hover:text-[var(--color-text)] transition-colors duration-150">
                  GitHub — {profile.github}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Form side */}
          <motion.div
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-brand-emerald/10 border border-brand-emerald/30
                                flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-brand-emerald" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-2">Message sent</h3>
                  <p className="text-brand-muted text-sm">I'll get back to you as soon as possible.</p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-brand-accent text-sm hover:underline font-mono mt-2"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-8">
                <h2 className="font-display font-semibold text-lg">Send a Message</h2>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-xs text-brand-muted uppercase tracking-widest mb-2">
                      Name <span className="text-brand-accent">*</span>
                    </label>
                    <input type="text" placeholder="Your name" {...fieldProps('name')}
                           className="input-underline" />
                    {errors.name && <p className="text-red-400 text-xs mt-1 font-mono">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-brand-muted uppercase tracking-widest mb-2">
                      Email <span className="text-brand-accent">*</span>
                    </label>
                    <input type="email" placeholder="your@email.com" {...fieldProps('email')}
                           className="input-underline" />
                    {errors.email && <p className="text-red-400 text-xs mt-1 font-mono">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-brand-muted uppercase tracking-widest mb-2">
                    Subject <span className="text-brand-accent">*</span>
                  </label>
                  <input type="text" placeholder="What's this about?" {...fieldProps('subject')}
                         className="input-underline" />
                  {errors.subject && <p className="text-red-400 text-xs mt-1 font-mono">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block font-mono text-xs text-brand-muted uppercase tracking-widest mb-2">
                    Message <span className="text-brand-accent">*</span>
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell me about your project or opportunity…"
                    {...fieldProps('message')}
                    className="input-underline resize-none"
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1 font-mono">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-between disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>{submitting ? 'Sending…' : 'Send Message'}</span>
                  {submitting
                    ? <span className="w-4 h-4 rounded-full border-2 border-brand-bg/40 border-t-brand-bg animate-spin" />
                    : <Send className="w-4 h-4" />
                  }
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
