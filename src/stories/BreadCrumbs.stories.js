import React from 'react';
import BreadCrumb from '../core/components/fields/breadcrumb';

export default {
  title: 'SmartAI Camera/BreadCrumb',
  component: BreadCrumb,
};

const Template = (args) => <BreadCrumb {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'BreadCrumb',
  path: ['root path', 'sub path'],
  routes: ['root/url']
};
