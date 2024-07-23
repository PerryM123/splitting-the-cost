import { expect, test } from 'vitest'
import { render } from '@testing-library/vue'
import HelloWorld from './HelloWorld.vue'

test('renders name2', () => {
  const { getByText } = render(HelloWorld, {
    props: { name: 'World' }
  })
  const element = getByText('Hello World!')
  expect(element).toBeInTheDocument()
})
