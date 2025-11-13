import { type BaseEditor } from "slate";
import { ReactEditor } from "slate-react";


export type EditorType  = BaseEditor & ReactEditor;

export type CustomText = {
    text: string;
    bold?: boolean;
    underline?: boolean;
    superscript?: boolean;
    subscript?: boolean;
    italic?: boolean;
    code?: boolean;
    highlight?: boolean;
    strikethrough?: boolean;
    fontSize?: string;
};

export type AlignKey = "left" | "center" | "right" | "justify";

// export type CustomElement = {
//     type:string;
//     children: CustomText[];
//     align?: AlignKey;
// };

export type CustomElement = ParagraphElement | BlockQuoteElement | ListElement | ListItemElement | TableElement | TableRowElement | TableCellElement;

export type ParagraphElement = {
    type: "paragraph";
    children: CustomText[];
    align?: AlignKey;
}

export type BlockQuoteElement = {
    type: "block-quote";
    children: CustomText[];
    align?: AlignKey;
}

export type ListElement = {
    type: "numbered-list" | "bulleted-list";
    children: ListItemElement[];
    align?: AlignKey;
}

export type ListItemElement = {
    type: "list-item";
    children: CustomText[];
    align?: AlignKey;
}

export type TableElement = {
    type: "table";
    children: TableRowElement[];
}

export type TableRowElement = {
    type: "table-row";
    children: TableCellElement[];
}

export type TableCellElement = {
    type: "table-cell";
    children: CustomText[];
}


export type MarkKey = "bold" | "underline" | "superscript" | "subscript" | "italic" | "code" | "highlight" | "strikethrough";

export type ElementKey = AlignKey | "block-quote" | "numbered-list" | "bulleted-list" | "list-item" | "table" | "table-row" | "table-cell" | "paragraph";

