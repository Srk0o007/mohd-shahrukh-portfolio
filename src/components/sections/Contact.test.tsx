import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Contact } from './Contact'

const ENDPOINT = 'https://formspree.io/f/xleyzgzo'
const SUCCESS = 'Thank you! Your message has been sent.'
const ERROR_START = "Sorry, your message couldn't be sent."

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

function setup(fetchImpl?: (...args: unknown[]) => Promise<Response>) {
  const fetch = vi.fn(fetchImpl ?? (() => Promise.resolve(json(200, { ok: true }))))
  vi.stubGlobal('fetch', fetch)
  const user = userEvent.setup()
  render(<Contact />)
  const name = screen.getByLabelText(/What is Your Name/)
  const email = screen.getByLabelText(/Your Email Address/)
  const message = screen.getByLabelText(/How can I Help you\?/)
  const submit = () => user.click(screen.getByRole('button', { name: /Send/ }))
  const fill = async () => {
    await user.type(name, 'Asha')
    await user.type(email, 'asha@example.com')
    await user.type(message, 'Hello there')
  }
  return { user, fetch, name, email, message, submit, fill }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('09 — Contact details (FR-CON-01, FR-SOC-01)', () => {
  it('is a labelled region with the heading, intro and details word for word', () => {
    render(<Contact />)
    const region = screen.getByRole('region', { name: "Let's get in touch" })
    expect(region).toHaveAttribute('id', 'contact')
    expect(screen.getByText('09 — Contact')).toBeInTheDocument()
    expect(
      screen.getByText(/I enjoy discussing new projects and design challenges\./),
    ).toBeInTheDocument()
    const terms = screen.getAllByRole('term').map((t) => t.textContent)
    expect(terms).toEqual(['Based in', 'Phone', 'Email'])
    expect(screen.getByText('Bangalore, Karnataka, India')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '(+91) 9760787661' })).toHaveAttribute(
      'href',
      'tel:+919760787661',
    )
    expect(screen.getByRole('link', { name: 'khan.shahrukh156@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:khan.shahrukh156@gmail.com',
    )
  })

  it('has the GitHub, LinkedIn and Email text links and no Twitter (D4)', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: 'GitHub (opens in new tab)' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'LinkedIn (opens in new tab)' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      'mailto:khan.shahrukh156@gmail.com',
    )
    expect(document.body.textContent).not.toMatch(/twitter/i)
  })
})

describe('contact form markup (FR-CON-02, FR-CON-05, FR-CON-06)', () => {
  it('is a real POST form to Formspree with labelled, required fields', () => {
    render(<Contact />)
    const form = screen.getByRole('form', { name: 'Send Me a Message' })
    expect(form).toHaveAttribute('action', ENDPOINT)
    expect(form).toHaveAttribute('method', 'POST')
    const name = screen.getByLabelText(/What is Your Name/)
    expect(name).toHaveAttribute('name', 'name')
    expect(name).toHaveAttribute('autocomplete', 'name')
    expect(name).toBeRequired()
    const email = screen.getByLabelText(/Your Email Address/)
    expect(email).toHaveAttribute('type', 'email')
    expect(email).toHaveAttribute('autocomplete', 'email')
    expect(screen.getByLabelText(/How can I Help you\?/).tagName).toBe('TEXTAREA')
    expect(screen.getAllByText('(required)')).toHaveLength(3)
  })

  it('carries a honeypot hidden from everyone', () => {
    const { container } = render(<Contact />)
    const honeypot = container.querySelector('input[name="_gotcha"]') as HTMLInputElement
    expect(honeypot.closest('[hidden]')).not.toBeNull()
    expect(honeypot).toHaveAttribute('tabindex', '-1')
  })

  it('keeps native validation in the server HTML (no-JS) and disables it after hydration', () => {
    const html = renderToString(<Contact />)
    expect(html).not.toContain('novalidate')
    render(<Contact />)
    expect(screen.getByRole('form')).toHaveAttribute('novalidate')
  })
})

describe('validation (FR-CON-03)', () => {
  it('shows linked errors, marks fields invalid and focuses the first invalid field', async () => {
    const { submit, name, email, message, fetch } = setup()
    await submit()
    expect(fetch).not.toHaveBeenCalled()
    for (const [field, text] of [
      [name, 'Please enter your name.'],
      [email, 'Please enter a valid email address.'],
      [message, 'Please enter a message.'],
    ] as const) {
      expect(field).toHaveAttribute('aria-invalid', 'true')
      expect(field).toHaveAccessibleDescription(expect.stringContaining(text))
    }
    expect(name).toHaveFocus()
  })

  it('updates errors live after the first attempt', async () => {
    const { user, submit, name, email } = setup()
    await submit()
    await user.type(name, 'Asha')
    expect(name).not.toHaveAttribute('aria-invalid')
    await user.type(email, 'not-an-email')
    expect(email).toHaveAttribute('aria-invalid', 'true')
    await user.clear(email)
    await user.type(email, 'asha@example.com')
    expect(email).not.toHaveAttribute('aria-invalid')
  })

  it('does not show errors while typing before the first attempt', async () => {
    const { user, email } = setup()
    await user.type(email, 'nope')
    await user.tab()
    expect(email).not.toHaveAttribute('aria-invalid')
  })

  it('reports over-long input with the limit', async () => {
    const { user, submit, fill, message } = setup()
    await fill()
    await user.click(message)
    await user.paste('x'.repeat(5001))
    await submit()
    expect(message).toHaveAccessibleDescription(
      expect.stringContaining('Please shorten this to 5000 characters or fewer.'),
    )
  })

  it('shows a passive character counter linked to the message field (FR-CON-07)', async () => {
    const { user, message } = setup()
    await user.type(message, 'Hello')
    expect(screen.getByText('5 / 5000')).toBeInTheDocument()
    expect(message).toHaveAccessibleDescription('5 / 5000')
    expect(screen.getByText('5 / 5000').closest('[aria-live]')).toBeNull()
  })
})

describe('submission (FR-CON-04)', () => {
  it('sends the form data and shows success only after Formspree confirms; then clears', async () => {
    let resolve: (r: Response) => void = () => {}
    const { fill, submit, fetch, name } = setup(() => new Promise<Response>((r) => (resolve = r)))
    await fill()
    await submit()

    const button = screen.getByRole('button', { name: 'Sending…' })
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(ENDPOINT)
    const body = init.body as FormData
    expect([body.get('name'), body.get('email'), body.get('message')]).toEqual([
      'Asha',
      'asha@example.com',
      'Hello there',
    ])
    expect(body.has('_gotcha')).toBe(true)

    resolve(json(200, { ok: true }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(SUCCESS))
    expect(name).toHaveValue('')
    expect(screen.getByRole('button', { name: /Send/ })).not.toHaveAttribute('aria-disabled')
  })

  it('blocks double submits while sending', async () => {
    const { fill, user, fetch } = setup(() => new Promise<Response>(() => {}))
    await fill()
    await user.click(screen.getByRole('button', { name: /Send/ }))
    await user.click(screen.getByRole('button', { name: 'Sending…' }))
    await user.keyboard('{Enter}')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it.each([
    ['a rejected submission (422)', () => Promise.resolve(json(422, { errors: [] }))],
    ['a server error (500)', () => Promise.resolve(json(500, {}))],
    ['a 2xx without confirmation', () => Promise.resolve(json(200, { ok: false }))],
    ['a network failure', () => Promise.reject(new TypeError('Failed to fetch'))],
  ])('never shows success for %s; keeps input and offers email', async (_, response) => {
    const { fill, submit, name, message } = setup(response)
    await fill()
    await submit()
    const alert = await screen.findByText(
      (_, el) => el?.tagName === 'SPAN' && el.textContent?.startsWith(ERROR_START) === true,
    )
    expect(screen.getByRole('alert')).toContainElement(alert)
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(screen.queryByText(SUCCESS)).toBeNull()
    expect(
      within(screen.getByRole('alert')).getByRole('link', { name: 'khan.shahrukh156@gmail.com' }),
    ).toHaveAttribute('href', 'mailto:khan.shahrukh156@gmail.com')
    expect(name).toHaveValue('Asha')
    expect(message).toHaveValue('Hello there')
  })

  it('clears the status when the visitor edits again', async () => {
    const { fill, submit, user, name } = setup(() => Promise.resolve(json(500, {})))
    await fill()
    await submit()
    await waitFor(() => expect(screen.getByRole('alert')).not.toBeEmptyDOMElement())
    await user.type(name, 'x')
    expect(screen.getByRole('alert')).toBeEmptyDOMElement()
  })
})
