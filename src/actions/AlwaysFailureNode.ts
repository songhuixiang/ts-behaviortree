import { SyncActionNode } from '../ActionNode';
import { NodeStatus } from '../BasicTypes';

/**
 * Simple actions that always returns FAILURE.
 */
export class AlwaysFailureNode extends SyncActionNode<{}> {
    constructor(name: string) {
        super(name, {});
        this.setRegistrationID('AlwaysFailure');
    }

    tick(): NodeStatus {
        return NodeStatus.FAILURE;
    }
}
