import React from 'react'
import { act } from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import App from './App'

afterEach(cleanup)

test('renders learn react link', () => {
  act(() => {
    // Wrap the rendering in act
    render(<App />)
  })
  const linkElement = screen.getByText(/Essay/i)
  expect(linkElement).toBeInTheDocument()
})
