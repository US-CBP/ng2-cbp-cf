export interface TreeNode {
    id: any;
    text: string;
    selectedText?: string | null | undefined;
    selectable?: boolean | null | undefined;
    children: TreeNode[];
    data?: any | null | undefined;
}
