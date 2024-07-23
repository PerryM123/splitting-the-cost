import { render, screen } from '@testing-library/vue'
import CommonButton from './CommonButton.vue'
import { describe, test, expect } from 'vitest'

describe('CommonButton', () => {
  test('CommonButtonを描画する', () => {
    render(CommonButton, {
      props: {
        onClick: () => {}
      },
      slots: {
        default: () => 'This is a button'
      }
    })
    expect(screen.getByText('This is a button'))
  })
})
