// import type { Meta, StoryObj } from '@storybook/react';
// import { MemoryRouter } from 'react-router-dom';
// import { NavigationBar } from './NavigationBar';
// import UserContext from '../../App';

// const meta = {
//     title: 'Example/NavigationBar',
//     component: NavigationBar,
//     decorators: [
//         (Story) => (
//             <MemoryRouter initialEntries= { ['/']} >
//             <Story />
//             < /MemoryRouter>
//     ),
//   ],
// parameters: {
//     layout: 'centered',
//   },
// } satisfies Meta<typeof NavigationBar>;

// export default meta;
// type Story = StoryObj<typeof meta>;

// export const LoggedOut: Story = {
//     decorators: [
//         (Story) => (
//             <UserContext.Provider value= { null} >
//             <Story />
//             < /UserContext.Provider>
//     ),
//   ],
// };

// export const LoggedIn: Story = {
//     decorators: [
//         (Story) => (
//             <UserContext.Provider value= {{ name: 'John Doe' }} >
//     <Story />
//     < /UserContext.Provider>
//     ),
//   ],
// };

export {}
