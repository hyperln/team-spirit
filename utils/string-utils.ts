export function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const defaults = { nonTextBehavior: 'remove' };

export function toPlainText(
  blocks: any[],
  opts: {
    nonTextBehavior?: 'remove';
  } = {},
): string {
  const options = { ...defaults, ...opts };
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) {
        return options.nonTextBehavior === 'remove'
          ? ''
          : `[${block._type} block]`;
      }

      return block.children.map((child: any) => child.text || '').join('');
    })
    .join('\n\n');
}

export function removeLeadingSlash(text: string) {
  return text.replace(/^\/+/g, '');
}

export function removeTrailingSlash(text: string) {
  return text.replace(/\/$/, '');
}

export function kebabToSentenceCase(s: string) {
  return s
    .split('-')
    .map((word) => {
      return word.slice(0, 1).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
