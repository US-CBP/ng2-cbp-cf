import { Injectable }           from '@angular/core';
import {
    BehaviorSubject,
    Observable
}                               from 'rxjs';

import { DropdownTreeState }    from './dropdown-tree-state.model';
import { TreeNode }             from './tree-node.model';

@Injectable()
export class DropdownTreeService {
    private _stateObservable: Observable<DropdownTreeState>;
    private _stateBehavior: BehaviorSubject<DropdownTreeState>;
    private _state: DropdownTreeState;

    constructor() {
        this._state = {
            highlightedNode: null,
            selectedNode: null,
            expandedNodes: new Set<TreeNode>()
        };
        this._stateBehavior = new BehaviorSubject<DropdownTreeState>(this._state);
        this._stateObservable = this._stateBehavior.asObservable();
    }

    get stateObservable(): Observable<DropdownTreeState> {
        return this._stateObservable;
    }

    setState(highlightedNode: TreeNode, selectedNode: TreeNode, expandedNodes: Set<TreeNode>) {
        this._state = {
            highlightedNode,
            selectedNode,
            expandedNodes
        };
        this._stateBehavior.next(this._state);
    }

    highlightNode(node: TreeNode) {
        if(node !== this._state.highlightedNode) {
            this.setState(node, this._state.selectedNode, this._state.expandedNodes);
        }
    }

    selectNode(node: TreeNode) {
        if(node !== this._state.selectedNode) {
            this.setState(this._state.highlightedNode, node, this._state.expandedNodes);
        }
    }

    expandNode(node: TreeNode) {
        if(node.children != null && node.children.length > 0 && !this._state.expandedNodes.has(node)) {
            let expandedNodes = new Set<TreeNode>(this._state.expandedNodes);
            expandedNodes.add(node);

            this.setState(this._state.highlightedNode, this._state.selectedNode, expandedNodes);
        }
    }

    collapseNode(node: TreeNode) {
        if(node.children != null && node.children.length > 0 && this._state.expandedNodes.has(node)) {
            let expandedNodes = new Set<TreeNode>(this._state.expandedNodes);
            expandedNodes.delete(node);

            this.setState(this._state.highlightedNode, this._state.selectedNode, expandedNodes);
        }
    }

    toggleNodeExpansion(node: TreeNode) {
        if(node.children != null && node.children.length > 0) {
            if(this._state.expandedNodes.has(node)) {
                this.collapseNode(node);
            } else {
                this.expandNode(node);
            }
        }
    }

    createTreeItemId(prefix: string, node: TreeNode): string {
        return prefix + node.id.toString();
    }

    isNodeExpanded(node: TreeNode): boolean {
        return node.children != null && node.children.length > 0 && this._state.expandedNodes.has(node);
    }

    currentState(): DropdownTreeState {
        return Object.assign({}, this._state, {
            expandedNodes: new Set<TreeNode>(this._state.expandedNodes)
        });
    }
}
