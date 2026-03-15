"use client";

import type { Editor } from '@tiptap/react';
import { useEditor, EditorContent } from '@tiptap/react';
import { TextSelection } from '@tiptap/pm/state';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  Quote,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Code,
  TerminalSquare,
  RemoveFormatting
} from 'lucide-react';
import type { MutableRefObject } from 'react';
import { useCallback, useRef } from 'react';

const alignableNodeTypes = new Set(['paragraph', 'heading']);

type StoredSelection = { from: number; to: number } | null;

function applyStoredSelectionIfNeeded(editor: Editor, storedSelectionRef: MutableRefObject<StoredSelection>) {
  const storedSelection = storedSelectionRef.current;
  if (!storedSelection) return;
  const { from, to } = storedSelection;
  if (from === to) return;
  if (!editor.state.selection.empty) return;
  editor
    .chain()
    .focus()
    .command(({ tr, state, dispatch }) => {
      const nextFrom = Math.min(Math.max(0, from), state.doc.content.size);
      const nextTo = Math.min(Math.max(0, to), state.doc.content.size);
      if (nextFrom === nextTo) return false;
      tr.setSelection(TextSelection.create(state.doc, nextFrom, nextTo));
      if (dispatch) dispatch(tr);
      return true;
    })
    .run();
}

function updateTextAlignForSelection(editor: Editor, alignment: string | null, storedSelectionRef: MutableRefObject<StoredSelection>) {
  const storedSelection = storedSelectionRef.current;
  editor
    .chain()
    .focus()
    .command(({ tr, state, dispatch }) => {
      const { from, to, empty, $from } = state.selection;
      const effectiveFrom = empty && storedSelection ? storedSelection.from : from;
      const effectiveTo = empty && storedSelection ? storedSelection.to : to;
      let updatedAny = false;

      if (effectiveFrom !== effectiveTo) {
        state.doc.nodesBetween(effectiveFrom, effectiveTo, (node, pos) => {
          if (alignableNodeTypes.has(node.type.name)) {
            const nextAttrs = { ...node.attrs, textAlign: alignment };
            tr.setNodeMarkup(pos, undefined, nextAttrs);
            updatedAny = true;
            return false;
          }
          return true;
        });
      }

      if (!updatedAny) {
        for (let depth = $from.depth; depth > 0; depth -= 1) {
          const node = $from.node(depth);
          if (!alignableNodeTypes.has(node.type.name)) continue;
          const pos = $from.before(depth);
          const nextAttrs = { ...node.attrs, textAlign: alignment };
          tr.setNodeMarkup(pos, undefined, nextAttrs);
          updatedAny = true;
          break;
        }
      }

      if (!updatedAny) return false;

      if (dispatch) dispatch(tr);
      return true;
    })
    .run();
}

const MenuBar = ({ editor, storedSelectionRef }: { editor: Editor | null; storedSelectionRef: MutableRefObject<StoredSelection> }) => {
  const addImage = useCallback(() => {
    if (!editor) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      if (input.files?.length) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const src = e.target?.result as string;
            editor.chain().focus().setImage({ src }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [editor]);

  const addYoutube = useCallback(() => {
    if (!editor) return;
    const url = prompt('Enter YouTube URL');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    applyStoredSelectionIfNeeded(editor, storedSelectionRef);
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor, storedSelectionRef]);

  const handleAlign = useCallback(
    (alignment: 'left' | 'center' | 'right' | 'justify') => {
      if (!editor) return;
      const isAlreadyAligned = editor.isActive({ textAlign: alignment });
      updateTextAlignForSelection(editor, isAlreadyAligned ? null : alignment, storedSelectionRef);
    },
    [editor, storedSelectionRef],
  );

  if (!editor) {
    return null;
  }

  const btnClass = (opts?: { isActive?: boolean; isDisabled?: boolean }) => {
    const isActive = opts?.isActive ?? false;
    const isDisabled = opts?.isDisabled ?? false;
    const base =
      'h-9 w-9 inline-flex items-center justify-center rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow/50';
    if (isDisabled) return `${base} text-neutral-300 cursor-not-allowed`;
    if (isActive) return `${base} bg-brand-yellow text-neutral-900 hover:bg-[#eac45a]`;
    return `${base} text-neutral-600 hover:bg-neutral-200`;
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-neutral-200 bg-neutral-50 rounded-t-lg sticky top-0 z-10">
      <button
        onClick={() => editor.chain().focus().undo().run()}
        onPointerDown={(e) => e.preventDefault()}
        disabled={!editor.can().undo()}
        className={btnClass({ isDisabled: !editor.can().undo() })}
        title="Undo"
        type="button"
        aria-label="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        onPointerDown={(e) => e.preventDefault()}
        disabled={!editor.can().redo()}
        className={btnClass({ isDisabled: !editor.can().redo() })}
        title="Redo"
        type="button"
        aria-label="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-neutral-300 mx-1 self-center" />

      <button
        onClick={() => {
          applyStoredSelectionIfNeeded(editor, storedSelectionRef);
          editor.chain().focus().toggleBold().run();
        }}
        onPointerDown={(e) => e.preventDefault()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={btnClass({
          isActive: editor.isActive('bold'),
          isDisabled: !editor.can().chain().focus().toggleBold().run(),
        })}
        title="Bold"
        type="button"
        aria-label="Bold"
        aria-pressed={editor.isActive('bold')}
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          applyStoredSelectionIfNeeded(editor, storedSelectionRef);
          editor.chain().focus().toggleItalic().run();
        }}
        onPointerDown={(e) => e.preventDefault()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={btnClass({
          isActive: editor.isActive('italic'),
          isDisabled: !editor.can().chain().focus().toggleItalic().run(),
        })}
        title="Italic"
        type="button"
        aria-label="Italic"
        aria-pressed={editor.isActive('italic')}
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          applyStoredSelectionIfNeeded(editor, storedSelectionRef);
          editor.chain().focus().toggleUnderline().run();
        }}
        onPointerDown={(e) => e.preventDefault()}
        className={btnClass({ isActive: editor.isActive('underline') })}
        title="Underline"
        type="button"
        aria-label="Underline"
        aria-pressed={editor.isActive('underline')}
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          applyStoredSelectionIfNeeded(editor, storedSelectionRef);
          editor.chain().focus().toggleStrike().run();
        }}
        onPointerDown={(e) => e.preventDefault()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={btnClass({
          isActive: editor.isActive('strike'),
          isDisabled: !editor.can().chain().focus().toggleStrike().run(),
        })}
        title="Strike"
        type="button"
        aria-label="Strike"
        aria-pressed={editor.isActive('strike')}
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          applyStoredSelectionIfNeeded(editor, storedSelectionRef);
          editor.chain().focus().toggleCode().run();
        }}
        onPointerDown={(e) => e.preventDefault()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={btnClass({
          isActive: editor.isActive('code'),
          isDisabled: !editor.can().chain().focus().toggleCode().run(),
        })}
        title="Inline Code"
        type="button"
        aria-label="Inline Code"
        aria-pressed={editor.isActive('code')}
      >
        <Code className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        onPointerDown={(e) => e.preventDefault()}
        className={btnClass()}
        title="Clear Formatting"
        type="button"
        aria-label="Clear Formatting"
      >
        <RemoveFormatting className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-neutral-300 mx-1 self-center" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        onPointerDown={(e) => e.preventDefault()}
        className={btnClass({ isActive: editor.isActive('heading', { level: 1 }) })}
        title="Heading 1"
        type="button"
        aria-label="Heading 1"
        aria-pressed={editor.isActive('heading', { level: 1 })}
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        onPointerDown={(e) => e.preventDefault()}
        className={btnClass({ isActive: editor.isActive('heading', { level: 2 }) })}
        title="Heading 2"
        type="button"
        aria-label="Heading 2"
        aria-pressed={editor.isActive('heading', { level: 2 })}
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-neutral-300 mx-1 self-center" />

      <button
        onClick={() => handleAlign('left')}
        onPointerDown={(e) => e.preventDefault()}
        className={btnClass({ isActive: editor.isActive({ textAlign: 'left' }) })}
        title="Align Left"
        type="button"
        aria-label="Align Left"
        aria-pressed={editor.isActive({ textAlign: 'left' })}
      >
        <AlignLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleAlign('center')}
        onPointerDown={(e) => e.preventDefault()}
        className={btnClass({ isActive: editor.isActive({ textAlign: 'center' }) })}
        title="Align Center"
        type="button"
        aria-label="Align Center"
        aria-pressed={editor.isActive({ textAlign: 'center' })}
      >
        <AlignCenter className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleAlign('right')}
        onPointerDown={(e) => e.preventDefault()}
        className={btnClass({ isActive: editor.isActive({ textAlign: 'right' }) })}
        title="Align Right"
        type="button"
        aria-label="Align Right"
        aria-pressed={editor.isActive({ textAlign: 'right' })}
      >
        <AlignRight className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleAlign('justify')}
        onPointerDown={(e) => e.preventDefault()}
        className={btnClass({ isActive: editor.isActive({ textAlign: 'justify' }) })}
        title="Align Justify"
        type="button"
        aria-label="Align Justify"
        aria-pressed={editor.isActive({ textAlign: 'justify' })}
      >
        <AlignJustify className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-neutral-300 mx-1 self-center" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        onPointerDown={(e) => e.preventDefault()}
        className={btnClass({ isActive: editor.isActive('bulletList') })}
        title="Bullet List"
        type="button"
        aria-label="Bullet List"
        aria-pressed={editor.isActive('bulletList')}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        onPointerDown={(e) => e.preventDefault()}
        className={btnClass({ isActive: editor.isActive('orderedList') })}
        title="Ordered List"
        type="button"
        aria-label="Ordered List"
        aria-pressed={editor.isActive('orderedList')}
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        onPointerDown={(e) => e.preventDefault()}
        className={btnClass({ isActive: editor.isActive('blockquote') })}
        title="Blockquote"
        type="button"
        aria-label="Blockquote"
        aria-pressed={editor.isActive('blockquote')}
      >
        <Quote className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        onPointerDown={(e) => e.preventDefault()}
        className={btnClass({ isActive: editor.isActive('codeBlock') })}
        title="Code Block"
        type="button"
        aria-label="Code Block"
        aria-pressed={editor.isActive('codeBlock')}
      >
        <TerminalSquare className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-neutral-300 mx-1 self-center" />

      <button
        onClick={setLink}
        onPointerDown={(e) => e.preventDefault()}
        className={btnClass({ isActive: editor.isActive('link') })}
        title="Link"
        type="button"
        aria-label="Link"
        aria-pressed={editor.isActive('link')}
      >
         <LinkIcon className="w-4 h-4" />
      </button>
      <button onClick={addImage} onPointerDown={(e) => e.preventDefault()} className={btnClass()} title="Image" type="button" aria-label="Image">
         <ImageIcon className="w-4 h-4" />
      </button>
      <button onClick={addYoutube} onPointerDown={(e) => e.preventDefault()} className={btnClass()} title="YouTube" type="button" aria-label="YouTube">
         <YoutubeIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  const storedSelectionRef = useRef<StoredSelection>(null);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Youtube.configure({
        controls: false,
        width: 640,
        height: 480,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
            class: 'text-brand-yellow hover:underline cursor-pointer',
        },
      }),
    ],
    content: value,
    editorProps: {
        attributes: {
            class: 'rte prose prose-neutral max-w-none focus:outline-none min-h-[300px] p-4 bg-white rounded-b-lg'
        }
    },
    onSelectionUpdate: ({ editor }) => {
      if (!editor.isFocused) return;
      const { from, to } = editor.state.selection;
      storedSelectionRef.current = { from, to };
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border border-neutral-300 rounded-lg shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-brand-yellow/50 focus-within:border-brand-yellow transition-all">
      <MenuBar editor={editor} storedSelectionRef={storedSelectionRef} />
      <EditorContent editor={editor} />
    </div>
  );
}
