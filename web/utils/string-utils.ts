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
