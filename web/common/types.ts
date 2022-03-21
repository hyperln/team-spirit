import { ReactElement } from 'react';
import {
  NavItemKind,
  NavItemStyle,
  NavItemActionFunction,
} from '@lib/cms/cms-types';

export type Image = {
  src: string;
  alt: string;
  extension?: string;
};

export type NavLink = {
  _key: string;
  type: 'internal' | 'external';
  href: string;
  label: string | ReactElement;
  icon?: Image;
  kind?: NavItemKind;
  style: NavItemStyle;
  function?: NavItemActionFunction;
  linkStyle?: 'text' | 'icon' | 'both';
  subItems?: Omit<NavLink, 'subItems'>[];
};
