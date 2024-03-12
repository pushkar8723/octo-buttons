import type { Meta, StoryObj } from '@storybook/react';
import StarButton from '../src/components/StarButton';

const meta = {
    title: 'Components/StarButton',
    component: StarButton,
    parameters: {},
    tags: ['autodocs'],
} satisfies Meta<typeof StarButton>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Primary: Story = {
    args: {
        repo: 'facebook/react',
    },
};
