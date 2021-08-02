import { NodeStatus, NodeType } from '../BasicTypes';
import { DecoratorNode } from '../DecoratorNode';

/**
 * @brief The SubtreeNode is a way to wrap an entire Subtree, creating a separated BlackBoard.
 */

export class SubtreeNode extends DecoratorNode<{}> {
    constructor(name: string) {
        super(name, {});
        this.setRegistrationID('SubTree');
    }

    type() {
        return NodeType.SUBTREE;
    }

    tick(): NodeStatus {
        const prev_status = this.status();
        if (prev_status == NodeStatus.IDLE) {
            this.setStatus(NodeStatus.RUNNING);
        }
        return this.child().executeTick();
    }
}
