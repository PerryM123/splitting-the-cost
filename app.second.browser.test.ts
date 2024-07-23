import { render, screen, cleanup } from '@testing-library/vue'
import { describe, test, expect, beforeEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import App from './app.vue'

describe('(test)App', () => {
  test('もし空のまま、次へをクリックされる場合、ページ遷移せずにエラーメッセージが表示される', async () => {
    const { getByText } = render(App, {
      props: {},
      slots: {}
    })
    const errorText = '会計は空'
    let errorTextElement = await screen.queryByText(errorText)
    console.log('errorTextElement: ', errorTextElement)
    expect(errorTextElement).not.toBeInTheDocument()
    const button = await screen.findByText('次へ')
    console.log('button: ', button)
    await userEvent.click(button)
    errorTextElement = getByText(errorText)
    expect(errorTextElement).toBeInTheDocument()
  })
})
