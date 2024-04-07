import { createElement, JSX } from 'react';
import Image from 'next/image';

const NODE_MAP = {
  root: MarkdownNode,
  paragraph: ParagraphNode,
  heading: HeadingNode,
  text: TextNode,
  media: MediaNode,
  image: ImageNode,
  link: LinkNode,
  strong: StrongNode,
  missing: MissingNode,
  list: ListNode,
  listItem: ListItemNode,
  blockQuote: BlockQuoteNode
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

export default function MarkdownNode(node: TNode): JSX.Element {
  return (
    <div className="contents">
      {Children(node)}
    </div>
  );
}

export function ListNode(node: TNode, key?: TKey): JSX.Element {
  return (node.ordered)
    ? (<ol key={key}>{Children(node)}</ol>)
    : (<ul key={key}>{Children(node)}</ul>);
}

export function ListItemNode(node: TNode, key?: TKey): JSX.Element {
  return (
    <li key={key}>{Children(node)}</li>
  );
}

export function ParagraphNode(node: TNode, key?: TKey): JSX.Element {
  return (<p key={key}>{Children(node)}</p>);
}

export function HeadingNode(node: TNode, key?: TKey): JSX.Element {
  return createElement(
    `h${(node.depth || 0) + 1}`, 
    { key }, 
    Children(node)
  );
}

export function TextNode(node: TNode, key?: TKey): JSX.Element {
  return (<span>{node.value || ''}</span>);
}

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

function LinkNode(node: TNode, key?: TKey): JSX.Element {
  return (
    <a key={key} href={node.url}>{Children(node)}</a>
  );
}

function StrongNode(node: TNode, key?: TKey): JSX.Element {
  return (
    <span key={key} style={{ fontWeight: 'bold' }}>
      {Children(node)}
    </span>
  );
}

function BlockQuoteNode(node: TNode, key?: TKey): JSX.Element {
  return (
    <div key={key} className="blockquote">
      {node.value}
    </div>
  );
}

function MissingNode(node: TNode, key?: TKey): JSX.Element {
  return (
    <div key={key} className="missing">
      <pre>{JSON.stringify(node, null, '  ')}</pre>
    </div>
  );
}
