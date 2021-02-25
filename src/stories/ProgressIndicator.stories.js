import React from 'react';
import ProgressIndicator from '../core/components/progress-indicator';

export default {
  title: 'SmartAI Camera/ProgressIndicator',
  component: ProgressIndicator,
};

const Template = (args) => <ProgressIndicator {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'ProgressIndicator'
};
