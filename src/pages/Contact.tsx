import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Linkedin, Github, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
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

export default function Contact() {
  const { data: apiProfile } = useApi(getProfile)
  const p = apiProfile ?? PROFILE

  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<FormState>>({})

  const validate = (): boolean => {
    const e: Partial<FormState> = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.email.trim())   e.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address'
    if (!form.subject.trim()) e.subject = 'Subject is required'
    if (!form.message.trim()) e.message = 'Message is required'
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
      setErrors({ message: 'Failed to send message. Please email me directly.' })
    } finally {
      setSubmitting(false)
    }
  }

  const field = (key: keyof FormState) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
    className: `w-full px-4 py-3 rounded-lg bg-brand-subtle border text-white text-sm
                 placeholder:text-brand-muted transition-colors focus:outline-none
                 ${errors[key] ? 'border-red-500 focus:border-red-400' : 'border-brand-border focus:border-brand-accent'}`,
  })

  return (
    <div className="pt-24 pb-20">
      <Seo title="Contact" description="Get in touch with Mohamed Alderdiry for ML engineering roles, research collaborations, and interesting problems." path="/contact" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-brand-accent font-mono text-sm mb-2">// get in touch</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Contact</h1>
          <p className="text-brand-muted max-w-md">
            Open to ML engineering roles, research collaborations, and interesting problems.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Info cards */}
            {[
              { icon: Mail,     label: 'Email',    value: p.email,    href: `mailto:${p.email}` },
              { icon: Phone,    label: 'Phone',    value: p.phone,    href: `tel:${p.phone}` },
              { icon: MapPin,   label: 'Location', value: p.location, href: undefined },
              { icon: Clock,    label: 'Timezone', value: 'AST (UTC+3)',    href: undefined },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="glass rounded-xl p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-brand-accent" />
                </div>
                <div>
                  <p className="text-brand-muted text-xs mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-white text-sm hover:text-brand-accent transition-colors">
                      {value}
                    </a>
                  ) : (
                    <p className="text-white text-sm">{value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="glass rounded-xl p-4">
              <p className="text-brand-muted text-xs mb-3">Profiles</p>
              <div className="space-y-3">
                <a
                  href={`https://${p.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-brand-muted hover:text-brand-accent transition-colors text-sm"
                >
                  <Linkedin className="w-4 h-4" />
                  {p.linkedin}
                </a>
                <a
                  href={`https://${p.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-brand-muted hover:text-brand-accent transition-colors text-sm"
                >
                  <Github className="w-4 h-4" />
                  {p.github}
                </a>
              </div>
            </div>

            {/* QR placeholder */}
            <div className="glass rounded-xl p-5">
              <p className="text-brand-muted text-xs mb-3">QR Codes</p>
              <div className="grid grid-cols-3 gap-2">
                {['LinkedIn', 'Portfolio', 'vCard'].map((label) => (
                  <div key={label} className="flex flex-col items-center gap-1.5">
                    <div className="w-full aspect-square rounded bg-brand-subtle border border-brand-border
                                     flex items-center justify-center">
                      <span className="text-brand-muted text-xs font-mono">QR</span>
                    </div>
                    <span className="text-brand-muted text-xs">{label}</span>
                  </div>
                ))}
              </div>
              <p className="text-brand-muted text-xs mt-3 text-center font-mono">
                QR generation — Phase 3
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="glass rounded-xl p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30
                                   flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">Message sent!</h3>
                    <p className="text-brand-muted text-sm">
                      I'll get back to you as soon as possible.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-brand-accent text-sm hover:underline mt-2"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <h2 className="text-white font-semibold text-lg mb-6">Send a Message</h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1.5">
                        Name <span className="text-red-400">*</span>
                      </label>
                      <input type="text" placeholder="Your name" {...field('name')} />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1.5">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input type="email" placeholder="your@email.com" {...field('email')} />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-muted mb-1.5">
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <input type="text" placeholder="What's this about?" {...field('subject')} />
                    {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-muted mb-1.5">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Tell me about your project or opportunity…"
                      {...field('message')}
                    />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-brand-bg border-t-transparent animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Message
                      </>
                    )}
                  </button>

                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
