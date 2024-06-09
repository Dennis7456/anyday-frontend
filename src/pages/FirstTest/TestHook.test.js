import React from 'react';
import ReactDOM from 'react-dom';
import TestHook from './TestHook';
import { render, fireEvent, cleanup} from '@testing-library/react';
import App from '../../App';

afterEach(cleanup);

describe('Testing button actions', () => {
    it('Text in state changed when button clicked', () => {
        const { getByText } = render(<TestHook/>);
        expect(getByText(/Initial/i).textContent).toBe("Initial State")
        fireEvent.click(getByText("State Change Button"));
        expect(getByText(/Initial/i).textContent).toBe("Initial State Changed")
    })

    it('Button click changes props', () => {
        const { getByText } = render(<App>
            <TestHook />
        </App>)
        expect(getByText(/Dennis/i).textContent).toBe('Dennis');
        fireEvent.click(getByText("Change Name"))
        expect(getByText(/Marion/i).textContent).toBe("Marion")
    })
})