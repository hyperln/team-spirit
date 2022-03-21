import {
  SanityAsset,
  SanityImageSource,
} from '@sanity/image-url/lib/types/types';
import { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder';

export type CMSGetParam =
  | {
      id: string;
      slug?: never;
    }
  | {
      id?: never;
      slug: string;
    };

export enum CMSContentType {
  post = 'post',
  page = 'page',
  route = 'route',
  staticRoute = 'staticRoute',
  globalSiteLayout = 'globalSiteLayout',
}

export interface CMSContentBase {
  id: string;
  _type: CMSContentType;
  _updatedAt: string;
}

export interface Post extends CMSContentBase {
  slug: string;
  title: string;
  publishedAt: string;
  body: BodyContent[];
  mainImage: CMSImage;
  openGraph: CMSOpenGraph;
}

export interface CMSOpenGraph {
  enableOpenGraph?: boolean;
  description: string;
  image: CMSImage;
  locale: string;
  title: string;
  _type: 'openGraph';
}

export interface Page extends CMSContentBase {
  title: string;
  updatedAt: string;
  slug: string;
  settings: {
    _type: 'pageSettings';
    breadcrumbs: boolean;
    darkTheme: boolean;
    disallowRobots: boolean;
    includeInSitemap: boolean;
    pageTemplate: string;
    showLastUpdated: boolean;
    description: string;
    useSiteTitle: boolean;
    openGraph: CMSOpenGraph;
  };
  parentPage: Omit<Page, 'parentPage'>;
  sections: PageSection[];
}

export interface Route extends CMSContentBase {
  slug: string;
  page: Page;
}

export interface StaticRoute extends CMSContentBase {
  page: Page;
}

export interface ErrorContent extends CMSContentBase {
  error: boolean;
  statusCode: number;
  page: Page;
}

export type ImageDimensions = {
  aspectRatio: number;
  height: number;
  width: number;
};

export type PaletteVariant = {
  background: string;
  foreground: string;
  population: number;
  title: string;
};

export type Palette = {
  darkMuted: PaletteVariant;
  darkVibrant: PaletteVariant;
  dominant: PaletteVariant;
  lightMuted: PaletteVariant;
  lightVibrant: PaletteVariant;
  muted: PaletteVariant;
  vibrant: PaletteVariant;
};

export type CMSPalette = {
  background: string;
  foreground: string;
  population: number;
  title: string;
  _type: string;
};

export type CMSImageMetadata = {
  hasAlpha: boolean;
  isOpaque: boolean;
  lqip: string;
  dimensions: ImageDimensions;
  palette: {
    darkMuted: CMSPalette;
    darkVibrant: CMSPalette;
    dominant: CMSPalette;
    lightMuted: CMSPalette;
    lightVibrant: CMSPalette;
    muted: CMSPalette;
    vibrant: CMSPalette;
  };
};

export type CMSImage = {
  alt: string;
  asset: {
    extension: string;
    metadata: CMSImageMetadata;
    url: string;
  };
  caption?: string;
};

export type NavigationSection = Navigation & {
  title: string;
  _type: string;
  _key: string;
};

export type CMSFooter = {
  logo?: CMSImage;
  copyright: string;
  nav: {
    items: (NavigationSection | NavigationItem)[];
  };
  notes: BodyContent[];
};

export enum NavItemActionFunction {
  toggleTheme = 'toggleTheme',
}

export enum NavItemKind {
  button = 'button',
  link = 'link',
}

export enum NavItemStyle {
  icon = 'icon',
  text = 'text',
  both = 'both',
}

export type NavigationItem = {
  _key: string;
  text: string;
  _type: string;
  function?: NavItemActionFunction;
  icon?: CMSImage;
  kind?: NavItemKind;
  style?: NavItemStyle;
  link: {
    id?: string;
    slug?: string;
    href?: string;
    anchorLink?: string;
  };
};

export type Navigation = {
  items: NavigationItem[];
  title: string;
};

export type CMSHeader = {
  primaryNav: Navigation;
  secondaryNav?: Navigation;
  title?: string;
  logo?: CMSImage;
};

export interface SiteLayout extends CMSContentBase {
  footer: CMSFooter;
  header: CMSHeader;
}

export type CMSContent =
  | Post
  | Route
  | Page
  | StaticRoute
  | ErrorContent
  | SiteLayout;

export type CMSFactoryConfig = {
  preview?: boolean;
  language?: string;
};

export type SubscriptionCallback = (update: { result: CMSContent }) => void;

export type CMSQueryParams = {
  type: CMSContentType;
  slug?: string;
  id?: string;
  fallback?: boolean;
  limit?: number;
  offset?: number;
  order?: string;
  customQuery?: string;
};

export type CMSInterfaceMethods = {
  subscribeToType: (
    params: CMSQueryParams,
    callback: SubscriptionCallback,
  ) => Subscription;
  query: (
    params: CMSQueryParams,
  ) => Promise<CMSContent> | Promise<CMSContent[]>;
  getById: (params: CMSQueryParams) => Promise<CMSContent>;
  getSecret: () => string;
  getToken: () => string;
  getSiteLayout: () => Promise<CMSContent>;
  getUrlForImage: (source: SanityImageSource) => ImageUrlBuilder;
  getDocumentCount: ({
    type,
    customQuery,
  }: {
    type: CMSContentType;
    customQuery?: string;
  }) => Promise<number>;
};

export enum PageSections {
  hero = 'hero',
  cta = 'cta',
  gallery = 'gallery',
  form = 'form',
  video = 'video',
  bodyContent = 'bodyContent',
  pageBuilderColumns = 'pageBuilderColumns',
  blurb = 'blurb',
  image = 'image',
  textSection = 'textSection',
  listing = 'listing',
}

export type SectionComponent = {
  key: string;
  type: string;
};

export type HeroSection = SectionComponent & {
  alt: string;
  imageUrl: string;
  heading: string;
};

export type BodyContent = {
  _key: string;
  _type: string;
  style: string;
  children: unknown[];
  markdefs: unknown[];
};

export enum ColumnContentTypes {
  bodyContent = 'bodyContent',
  imageAlt = 'imageAlt',
}

export type ColumnContent = {
  content?: BodyContent[];
  alt?: string;
  caption?: string;
  asset?: SanityAsset;
  _type: string;
};

export type ColumnComponent = {
  _key: string;
  content: ColumnContent[];
};

export type ColumnsSection = SectionComponent & {
  columns: ColumnComponent[];
};

export type SectionHeading = {
  type: string;
  headingType: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text: string;
};

export type Color = {
  alpha: number;
  hex: string;
  rgb: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
};

export type SectionBackground = {
  color?: Color;
};

export enum ListingType {
  newsArticles = 'newsArticles',
}

export type PageSection = {
  key: string;
  type: string;
  components: (SectionComponent | HeroSection | ColumnsSection)[];
  heading?: SectionHeading;
  anchor: string;
  background?: SectionBackground;
  textColor?: Color;
};

export interface Unsubscribable {
  unsubscribe(): void;
}
export declare type TeardownLogic = Unsubscribable | Function | void;
export interface SubscriptionLike extends Unsubscribable {
  unsubscribe(): void;
  readonly closed: boolean;
}

/**
 * Represents a disposable resource, such as the execution of an Observable. A
 * Subscription has one important method, `unsubscribe`, that takes no argument
 * and just disposes the resource held by the subscription.
 *
 * Additionally, subscriptions may be grouped together through the `add()`
 * method, which will attach a child Subscription to the current Subscription.
 * When a Subscription is unsubscribed, all its children (and its grandchildren)
 * will be unsubscribed as well.
 *
 * @class Subscription
 */
export declare class Subscription implements SubscriptionLike {
  /** @nocollapse */
  static EMPTY: Subscription;

  /**
   * A flag to indicate whether this Subscription has already been unsubscribed.
   * @type {boolean}
   */
  closed: boolean;

  /** @internal */
  protected _parentOrParents: Subscription | Subscription[];

  /** @internal */
  private _subscriptions;
  /**
   * @param {function(): void} [unsubscribe] A function describing how to
   * perform the disposal of resources when the `unsubscribe` method is called.
   */
  constructor(unsubscribe?: () => void);
  /**
   * Disposes the resources held by the subscription. May, for instance, cancel
   * an ongoing Observable execution or cancel any other type of work that
   * started when the Subscription was created.
   * @return {void}
   */
  unsubscribe(): void;
  /**
   * Adds a tear down to be called during the unsubscribe() of this
   * Subscription. Can also be used to add a child subscription.
   *
   * If the tear down being added is a subscription that is already
   * unsubscribed, is the same reference `add` is being called on, or is
   * `Subscription.EMPTY`, it will not be added.
   *
   * If this subscription is already in an `closed` state, the passed
   * tear down logic will be executed immediately.
   *
   * When a parent subscription is unsubscribed, any child subscriptions that were added to it are also unsubscribed.
   *
   * @param {TeardownLogic} teardown The additional logic to execute on
   * teardown.
   * @return {Subscription} Returns the Subscription used or created to be
   * added to the inner subscriptions list. This Subscription can be used with
   * `remove()` to remove the passed teardown logic from the inner subscriptions
   * list.
   */
  add(teardown: TeardownLogic): Subscription;
  /**
   * Removes a Subscription from the internal list of subscriptions that will
   * unsubscribe during the unsubscribe process of this Subscription.
   * @param {Subscription} subscription The subscription to remove.
   * @return {void}
   */
  remove(subscription: Subscription): void;
}

export type HorizontalAlignment = 'left' | 'right' | 'center';

export type VerticalAlignment = 'top' | 'bottom' | 'middle';
