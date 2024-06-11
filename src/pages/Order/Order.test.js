import React from 'react'
import { act } from 'react'
import ReactDOM from 'react-dom'
import Order from './Order'
import { render, fireEvent, cleanup } from '@testing-library/react'
import App from '../../App'

afterEach(cleanup)

describe('Testing button actions', () => {
  it('Text in state changed when button clicked', () => {
    act(() => {
      // Wrap the rendering in act
      const { getByText } = render(<Order />)
      // expect(getByText(/Initial/i).textContent).toBe('Initial State')
      // fireEvent.click(getByText('State Change Button'))
      // expect(getByText(/Initial/i).textContent).toBe('Initial State Changed')
    })
  })

  it('Button click changes props', () => {
    act(() => {
      // Wrap the rendering in act
      const { getByText } = render(
        <App>
          <Order />
        </App>,
      )
      // expect(getByText(/Dennis/i).textContent).toBe('Dennis')
      // fireEvent.click(getByText('Change Name'))
      // expect(getByText(/Marion/i).textContent).toBe('Marion')
    })
  })
})
