import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Superscript,
  Subscript,
  Code,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  ListOrdered,
  List,
  Undo2,
  Redo2,
  Table,
} from "lucide-react";

export const RichTextAction = {
  Bold: "bold",
  Italics: "italic",
  Underline: "underline",
  Strikethrough: "strikethrough",
  Superscript: "superscript",
  Subscript: "subscript",
  Highlight: "highlight",
  Code: "code",
  LeftAlign: "left",
  CenterAlign: "center",
  RightAlign: "right",
  JustifyAlign: "justify",
  Divider: "divider",
  BlockQuote: "block-quote",
  NumberedList: "numbered-list",
  BulletedList: "bulleted-list",
  Undo: "undo",
  Redo: "redo",
  Table: "table",
} as const;

export type RichTextAction =
  (typeof RichTextAction)[keyof typeof RichTextAction];

export const TEXT_FORMAT_OPTIONS = [
  { id: RichTextAction.Bold, label: "Bold", icon: Bold },
  { id: RichTextAction.Italics, label: "Italics", icon: Italic },
  { id: RichTextAction.Underline, label: "Underline", icon: Underline },
  {
    id: RichTextAction.Highlight,
    label: "Highlight",
    icon: Highlighter,
  },
  {
    id: RichTextAction.Strikethrough,
    label: "Strikethrough",
    icon: Strikethrough,
  },
  {
    id: RichTextAction.Superscript,
    label: "Superscript",
    icon: Superscript,
  },
  {
    id: RichTextAction.Subscript,
    label: "Subscript",
    icon: Subscript,
  },
  {
    id: RichTextAction.Code,
    label: "Code",
    icon: Code,
  },
];

export const TEXT_BLOCK_OPTIONS = [
  {
    id: RichTextAction.LeftAlign,
    icon: AlignLeft,
    label: "Left Align",
  },
  {
    id: RichTextAction.CenterAlign,
    icon: AlignCenter,
    label: "Center Align",
  },
  {
    id: RichTextAction.RightAlign,
    icon: AlignRight,
    label: "Right Align",
  },
  {
    id: RichTextAction.JustifyAlign,
    icon: AlignJustify,
    label: "Justify Align",
  },
  {
    id: RichTextAction.BlockQuote,
    icon: Quote,
    label: "Block Quote",
  },
  {
    id: RichTextAction.NumberedList,
    icon: ListOrdered,
    label: "Numbered List",
  },
  {
    id: RichTextAction.BulletedList,
    icon: List,
    label: "Bulleted List",
  },
  {
    id: RichTextAction.Table,
    icon: Table,
    label: "Insert Table",
  },
];

export const HISTORY_OPTIONS = [
  {
    id: RichTextAction.Undo,
    icon: Undo2,
    label: "Undo",
  },
  {
    id: RichTextAction.Redo,
    icon: Redo2,
    label: "Redo",
  },
];

export const HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
export const LIST_TYPES = ["numbered-list", "bulleted-list"];
export const ALIGN_TYPES = ["left", "center", "right", "justify"];
export const TABLE_SIZE_OPTIONS = ["1x1", "2x2", "3x3", "4x4", "5x5"];