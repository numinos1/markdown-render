import { createElement, JSX } from 'react';
import Image from 'next/image';

const NODE_MAP = {
  paragraph: ParagraphNode,
  section: SectionNode,
  heading: HeadingNode,
  text: TextNode,
  media: MediaNode,
  image: ImageNode,
  link: LinkNode,
  strong: StrongNode,
  missing: MissingNode,
  list: ListNode,
  listItem: ListItemNode,
  blockquote: BlockquoteNode
};

export interface TNode {
  type: TType
  children: TNode[];
  [key: string]: any;
}

export type TType = keyof typeof NODE_MAP;

export type TKey = string | number;

export function Children(node: TNode, key?: TKey): JSX.Element[] | null {
  return node.children ? node.children.map(Node) : null;
}

export function Node(node: TNode, key?: TKey): JSX.Element {
  return (NODE_MAP[node.type] || MissingNode)(node, key);
}

/**
 * Render Markdown Component
 */
export function Markdown({ document, className }: {
  document: TNode;
  className?: string;
  classNames?: Record<string, string>;
}): JSX.Element {
  return (
    <div className={className || 'contents'}>
      {Children(document)}
    </div>
  );
}

/**
 * List
 */
export function ListNode(node: TNode, key?: TKey): JSX.Element {
  return (node.ordered)
    ? (<ol key={key}>{Children(node)}</ol>)
    : (<ul key={key}>{Children(node)}</ul>);
}
 
/**
 * ListItem
 */
export function ListItemNode(node: TNode, key?: TKey): JSX.Element {
  return (
    <li key={key}>{Children(node)}</li>
  );
}

/**
 * Paragraph
 */
export function ParagraphNode(node: TNode, key?: TKey): JSX.Element {
  return (<p key={key}>{node.value}</p>); //{Children(node)}</p>);
}

/**
 * Section
 */
export function SectionNode(node: TNode, key?: TKey): JSX.Element {
  return (
    <div className="section">
      {node.title ? HeadingNode(node, key) : null}
      {Children(node)}
    </div>
  );
}

/**
 * Heading
 */
export function HeadingNode(node: TNode, key?: TKey): JSX.Element {
  return createElement(
    `h${(node.depth || 0) + 1}`, 
    { key: 'heading' }, 
    node.title
  );
}

/**
 * Text
 */
export function TextNode(node: TNode, key?: TKey): JSX.Element {
  return (<span>{node.value || ''}</span>);
}

/**
 * Media
 */
export function MediaNode(node: TNode, key?: TKey): JSX.Element {
  const images = node.children;
  const style = (images.length === 1)
    ? 'media-single'
    : 'media-grid';

  return (
    <div key={key} className={'media ' + style}>
      {images.map(Node)}
    </div>
  );
}

/**
 * Image
 */
export function ImageNode(node: TNode, key?: TKey): JSX.Element {
  const title = node.title || node.alt || '';

  return (
    <div key={key} className="image">
      <Image
        src={node.url || ''}
        alt={node.alt || node.title || 'no title'}
      />
      {title ? (
        <h2>{title}</h2>
      ) : null}
    </div>
  );
}

/**
 * Link
 */
function LinkNode(node: TNode, key?: TKey): JSX.Element {
  return (
    <a key={key} href={node.url}>{Children(node)}</a>
  );
}

/**
 * Strong
 */
function StrongNode(node: TNode, key?: TKey): JSX.Element {
  return (
    <span key={key} style={{ fontWeight: 'bold' }}>
      {Children(node)}
    </span>
  );
}

/**
 * Blockquote
 */
function BlockquoteNode(node: TNode, key?: TKey): JSX.Element {
  return (
    <blockquote key={key}>
      <p>{node.value}</p>
    </blockquote>
  );
}

/**
 * Missing
 */
function MissingNode(node: TNode, key?: TKey): JSX.Element {
  return (
    <div key={key} className="missing">
      <pre>{JSON.stringify(node, null, '  ')}</pre>
    </div>
  );
}
