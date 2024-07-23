import { render, screen, cleanup } from '@testing-library/vue'
import { describe, test, expect, beforeEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import App from './app.vue'

describe('(test)App', () => {
  test('初期表示', async () => {
    const { getByText } = render(App, {
      props: {},
      slots: {}
    })
    const titleText = 'Splitting The Cost'
    const questionText1 = 'What is the 会計？'
    const questionText2 = '割引ある？'
    const errorText1 = '会計は空'
    const errorText2 =
      '割引は会計より高い値段になってしまいましたので再記入してください'
    let titleTextElement = await screen.queryByText(titleText)
    let questionText1Element = await screen.queryByText(questionText1)
    let questionText2Element = await screen.queryByText(questionText2)
    let errorText1Element = await screen.queryByText(errorText1)
    let errorText2Element = await screen.queryByText(errorText2)
    expect(titleTextElement).toBeInTheDocument()
    expect(questionText1Element).toBeInTheDocument()
    expect(questionText2Element).toBeInTheDocument()
    expect(errorText1Element).not.toBeInTheDocument()
    expect(errorText2Element).not.toBeInTheDocument()
  })
})
