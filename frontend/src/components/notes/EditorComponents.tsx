// @ts-nocheck

import { Editor, Element as SlateElement, Transforms } from 'slate'
import React, { PropsWithChildren, forwardRef } from 'react'
import { css, cx } from '@emotion/css'

import { useSlate } from 'slate-react'

const LIST_TYPES = [ 'numbered-list', 'bulleted-list' ]

interface BaseProps {
  className: string,
  [ key: string ]: unknown,
}

const Icon = forwardRef(
(
  { className, ...props }: PropsWithChildren<BaseProps>,
  ref: any,
) => (
  <span
    {...props}
    ref={ref}
    className={cx(
      'material-icons',
      className,
      css`
        font-size: 18px;
        vertical-align: text-bottom;
        margin-top: 10px;
        margin-right: 1px;
      `
    )}
  />
))

const Button = forwardRef(
  (
    { className, active, reversed, title, ...props }: PropsWithChildren<BaseProps>,
    ref: any,
  ) => (
  <span
    {...props}
    ref={ref}
    className={cx(
      className,
      // This span needs to have a higher z-index than
      // all the other layers that make up this component
      // so that the 'title' tooltip actually shows up on hover
      css`
        cursor: pointer;
        z-index: 20;
        color: ${reversed
          ? active
            ? 'white'
            : '#aaa'
          : active
          ? 'black'
          : '#ccc'};
      `
    )}
    title={title}
  />
))

export function MarkButton({ format, icon, title }) {
  const editor = useSlate()

  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={e => {
        e.preventDefault()
        toggleMark(editor, format)
      }}
      title={title}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
}

export function BlockButton({ format, icon, title }) {
  const editor = useSlate()
  
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={e => {
        e.preventDefault()
        toggleBlock(editor, format)
      }}
      title={title}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
}

export function SaveButton({ saveNote }) {
  return (
    <span
      onMouseDown={e => {
        e.preventDefault()
        saveNote()
      }}
      className={cx(
        'material-icons',
        css`
          cursor: pointer;
          color: black;
          float: right;
          margin-bottom: 5px;
        `
      )}
      title='Save'
    >
      <Icon>save</Icon>
    </span>
  );
}

export function DeleteButton({ deleteNote }) {
  return (
    <span
      onMouseDown={e => {
        e.preventDefault()
        deleteNote()
      }}
      className={cx(
        'material-icons-outlined',
        css`
          cursor: pointer;
          color: black;
          float: right;
          margin-bottom: 5px;
        `
      )}
      title='Delete'
    >
      <Icon>delete</Icon>
    </span>
  );
}

export function Element({ attributes, children, element }) {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
}

export function Leaf({ attributes, children, leaf }) {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  return <span {...attributes}>{children}</span>;
}

function isMarkActive(editor, format) {
  const marks = Editor.marks(editor)
  
  return marks ? marks[format] === true : false;
}

function isBlockActive(editor, format) {
  const [ match ] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  })

  return !!match;
}

function toggleMark(editor, format) {
  const isActive = isMarkActive(editor, format)
  
  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

function toggleBlock(editor, format) {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
      ),
    split: true,
  })

  const newProperties: Partial<SlateElement> = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  }
  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const Menu = forwardRef(({ className, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        & > * {
          display: inline-block;
        }
        
        & > * + * {
          margin-left: 15px;
        }
      `
    )}
  />
))

export const Toolbar = forwardRef(({ className, ...props }, ref) => (
  <Menu
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        position: relative;
        padding: 1px 18px 17px;
        margin: 0 -20px;
        border-bottom: 2px solid #eee;
        margin-top: 10px;
        margin-bottom: 20px;
      `
    )}
  />
))